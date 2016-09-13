
--DROP PROCEDURE [dbo].[DerivePlayerStatsGame]

CREATE PROCEDURE dbo.DerivePlayerStatsGame
	@StartingGameId int = 0, 
	@EndingGameId int = 0,
	@DryRun int = 0
AS
BEGIN TRY
	SET NOCOUNT ON
/*
-- START comment this out when saving as stored proc
	DECLARE @StartingGameId int;
	DECLARE @EndingGameId int;
	DECLARE @DryRun int;

	SET @StartingGameId = 3200;
	--SET @EndingGameId = 3319;

	--SET @StartingGameId = 3324;
	SET @EndingGameId = 3372;

	SET @DryRun = 0;
-- STOP comment this out when saving as stored proc
*/

	IF OBJECT_ID('tempdb..#results') IS NOT NULL DROP TABLE #results
	IF OBJECT_ID('tempdb..#statsDetail') IS NOT NULL DROP TABLE #statsDetail
	IF OBJECT_ID('tempdb..#playerStatGamesCopy') IS NOT NULL DROP TABLE #playerStatGamesCopy
	IF OBJECT_ID('tempdb..#playerStatGamesNew') IS NOT NULL DROP TABLE #playerStatGamesNew

	CREATE TABLE #results (
		TableName nvarchar(35) NOT NULL,
		NewRecordsInserted int NOT NULL,
		ExistingRecordsUpdated int NOT NULL,
		ExistingRecordsDeleted int NOT NULL,
		ProcessedRecordsMatchExistingRecords int NOT NULL
	)

	CREATE TABLE #statsDetail (
		PlayerId int NOT NULL,
		GameId int NOT NULL,
		TeamId int NOT NULL,
		Playoffs bit NOT NULL,
		SeasonId int NOT NULL,
		Sub bit NOT NULL,
		Line int NOT NULL,
		Position nvarchar(1) NOT NULL,
		Goals int NOT NULL,
		Assists int NOT NULL,
		Points int NOT NULL,
		PenaltyMinutes int NOT NULL,
		PowerPlayGoals int NOT NULL,
		ShortHandedGoals int NOT NULL,
		GameWinningGoals int NOT NULL
	)

	CREATE TABLE #playerStatGamesNew (
		PlayerId int NOT NULL,
		GameId int NOT NULL,
		TeamId int NOT NULL,
		Playoffs bit NOT NULL,
		SeasonId int NOT NULL,
		Sub bit NOT NULL,
		Line int NOT NULL,
		Position nvarchar(1) NOT NULL,
		Goals int NOT NULL,
		Assists int NOT NULL,
		Points int NOT NULL,
		PenaltyMinutes int NOT NULL,
		PowerPlayGoals int NOT NULL,
		ShortHandedGoals int NOT NULL,
		GameWinningGoals int NOT NULL,
		BCS int NULL
	)
	CREATE UNIQUE INDEX PK ON #playerStatGamesNew(PlayerId, GameId)

	CREATE TABLE #playerStatGamesCopy (
		PlayerId int NOT NULL,
		GameId int NOT NULL,
		TeamId int NOT NULL,
		Playoffs bit NOT NULL,
		SeasonId int NOT NULL,
		Sub bit NOT NULL,
		Line int NOT NULL,
		Position nvarchar(1) NOT NULL,
		Goals int NOT NULL,
		Assists int NOT NULL,
		Points int NOT NULL,
		PenaltyMinutes int NOT NULL,
		PowerPlayGoals int NOT NULL,
		ShortHandedGoals int NOT NULL,
		GameWinningGoals int NOT NULL,
		BCS int NULL
	)
	CREATE UNIQUE INDEX PK ON #playerStatGamesCopy(PlayerId, GameId)

	INSERT INTO #results
	SELECT
		'PlayerStatGames' as TableName,
		0 as NewRecordsInserted,
		0 as ExistingRecordsUpdated,
		0 as ExistingRecordsDeleted,
		0 as ProcessedRecordsMatchExistingRecords


	-- insert record for games played, for games without points
	insert into #statsDetail
	select
		gr.PlayerId,
		gr.GameId,
		gr.TeamId,
		g.Playoffs,
		gr.SeasonId,
		gr.Sub,
		gr.Line,
		gr.Position,
		0 as Goals,
		0 as Assists,
		0 as Points,
		0 as PenaltyMinutes,
		0 as PowerPlayGoals,
		0 as ShortHandedGoals,
		0 as GameWinningGoals
	from
		GameRosters gr inner join
		Games g on (gr.GameId = g.GameId)
	where
		gr.GameId between @StartingGameId and @EndingGameId

	insert into #statsDetail
	select
		ssepg.GoalPlayerId as PlayerId,
		ssepg.GameId,
		ssepg.TeamId,
		g.Playoffs,
		ssepg.SeasonId,
		gr.Sub,
		gr.Line,
		gr.Position,
		1 as Goals,
		0 as Assists,
		1 as Points,
		0 as PenaltyMinutes,
		convert(int,ssepg.PowerPlayGoal) as PowerPlayGoals,
		convert(int,ssepg.ShortHandedGoal) as ShortHandedGoals,
		convert(int,ssepg.GameWinningGoal) as GameWinningGoals
	from
		ScoreSheetEntryProcessedGoals ssepg inner join
		GameRosters gr on (ssepg.GameId = gr.GameId AND ssepg.TeamId = gr.TeamId AND ssepg.GoalPlayerId = gr.PlayerId) inner join
		Games g on (ssepg.GameId = g.GameId)
	where
		ssepg.GameId between @StartingGameId and @EndingGameId

	insert into #statsDetail
	select
		ssepg.Assist1PlayerId as PlayerId,
		ssepg.GameId,
		ssepg.TeamId,
		g.Playoffs,
		ssepg.SeasonId,
		gr.Sub,
		gr.Line,
		gr.Position,
		0 as Goals,
		1 as Assists,
		1 as Points,
		0 as PenaltyMinutes,
		0 as PowerPlayGoals,
		0 as ShortHandedGoals,
		0 as GameWinningGoals
	from
		ScoreSheetEntryProcessedGoals ssepg inner join
		GameRosters gr on (ssepg.GameId = gr.GameId AND ssepg.TeamId = gr.TeamId AND ssepg.Assist1PlayerId = gr.PlayerId) inner join
		Games g on (ssepg.GameId = g.GameId)
	where
		ssepg.GameId between @StartingGameId and @EndingGameId


	insert into #statsDetail
	select
		ssepg.Assist2PlayerId as PlayerId,
		ssepg.GameId,
		ssepg.TeamId,
		g.Playoffs,
		ssepg.SeasonId,
		gr.Sub,
		gr.Line,
		gr.Position,
		0 as Goals,
		1 as Assists,
		1 as Points,
		0 as PenaltyMinutes,
		0 as PowerPlayGoals,
		0 as ShortHandedGoals,
		0 as GameWinningGoals
	from
		ScoreSheetEntryProcessedGoals ssepg inner join
		GameRosters gr on (ssepg.GameId = gr.GameId AND ssepg.TeamId = gr.TeamId AND ssepg.Assist2PlayerId = gr.PlayerId) inner join
		Games g on (ssepg.GameId = g.GameId)
	where
		ssepg.GameId between @StartingGameId and @EndingGameId

	insert into #statsDetail
	select
		ssepg.Assist3PlayerId as PlayerId,
		ssepg.GameId,
		ssepg.TeamId,
		g.Playoffs,
		ssepg.SeasonId,
		gr.Sub,
		gr.Line,
		gr.Position,
		0 as Goals,
		1 as Assists,
		1 as Points,
		0 as PenaltyMinutes,
		0 as PowerPlayGoals,
		0 as ShortHandedGoals,
		0 as GameWinningGoals
	from
		ScoreSheetEntryProcessedGoals ssepg inner join
		GameRosters gr on (ssepg.GameId = gr.GameId AND ssepg.TeamId = gr.TeamId AND ssepg.Assist3PlayerId = gr.PlayerId) inner join
		Games g on (ssepg.GameId = g.GameId)
	where
		ssepg.GameId between @StartingGameId and @EndingGameId

	insert into #statsDetail
	select
		ssepp.PlayerId as PlayerId,
		ssepp.GameId,
		ssepp.TeamId,
		g.Playoffs,
		ssepp.SeasonId,
		gr.Sub,
		gr.Line,
		gr.Position,
		0 as Goals,
		0 as Assists,
		0 as Points,
		ssepp.PenaltyMinutes,
		0 as PowerPlayGoals,
		0 as ShortHandedGoals,
		0 as GameWinningGoals
	from
		ScoreSheetEntryProcessedPenalties ssepp inner join
		GameRosters gr on (ssepp.GameId = gr.GameId AND ssepp.TeamId = gr.TeamId AND ssepp.PlayerId = gr.PlayerId) inner join
		Games g on (ssepp.GameId = g.GameId)
	where
		ssepp.GameId between @StartingGameId and @EndingGameId

	-- was affecting other PKs due to potential to sub for multiple lines/positions
	update #statsDetail
	set Line = 0, Position = 'S'
	where Sub = 1

	insert into #playerStatGamesNew
	select
		s.PlayerId,
		s.GameId,
		s.TeamId,
		s.Playoffs,
		s.SeasonId,
		s.Sub,
		s.Line,
		s.Position,
		sum(s.Goals) as Goals,
		sum(s.Assists) as Assists,
		sum(s.Points) as Points,
		sum(s.PenaltyMinutes) as PenaltyMinutes,
		sum(s.PowerPlayGoals) as PowerPlayGoals,
		sum(s.ShortHandedGoals) as ShortHandedGoals,
		sum(s.GameWinningGoals) as GameWinningGoals,
		NULL as BCS
	from
		#statsDetail s
	where
		s.PlayerId <> 0
	group by
		s.PlayerId,
		s.GameId,
		s.TeamId,
		s.Playoffs,
		s.SeasonId,
		s.Sub,
		s.Line,
		s.Position

	update #playerStatGamesNew
	set
		BCS = BINARY_CHECKSUM(PlayerId,
								GameId,
								TeamId,
								Playoffs,
								SeasonId,
								Sub,
								Line,
								Position,
								Goals,
								Assists,
								Points,
								PenaltyMinutes,
								PowerPlayGoals,
								ShortHandedGoals,
								GameWinningGoals)


	INSERT INTO #playerStatGamesCopy
	SELECT 
		PlayerId,
		GameId,
		TeamId,
		Playoffs,
		SeasonId,
		Sub,
		Line,
		Position,
		Goals,
		Assists,
		Points,
		PenaltyMinutes,
		PowerPlayGoals,
		ShortHandedGoals,
		GameWinningGoals,
		BINARY_CHECKSUM(PlayerId,
								GameId,
								TeamId,
								Playoffs,
								SeasonId,
								Sub,
								Line,
								Position,
								Goals,
								Assists,
								Points,
								PenaltyMinutes,
								PowerPlayGoals,
								ShortHandedGoals,
								GameWinningGoals) as BCS
	FROM 
		PlayerStatGames


	IF (@dryrun = 1) 
	BEGIN
		-- this is not a dry run
		PRINT 'DRY RUN. NOT UPDATING REAL TABLES'
		
		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		delete from #playerStatGamesCopy
		from
			#playerStatGamesCopy c left join
			#playerStatGamesNew n on (c.PlayerId = n.PlayerId AND c.GameId = n.GameId)
		where
			n.GameId is null and
			c.GameId between @StartingGameId and @EndingGameId

		update #results set ExistingRecordsDeleted = @@ROWCOUNT

		update #playerStatGamesCopy
		set
			TeamId = n.TeamId,
			Playoffs = n.Playoffs,
			SeasonId = n.SeasonId,
			Sub = n.Sub,
			Line = n.Line,
			Position = n.Position,
			Goals = n.Goals,
			Assists = n.Assists,
			Points = n.Points,
			PenaltyMinutes = n.PenaltyMinutes,
			PowerPlayGoals = n.PowerPlayGoals,
			ShortHandedGoals = n.ShortHandedGoals,
			GameWinningGoals = n.GameWinningGoals
		from
			#playerStatGamesCopy c INNER JOIN
			#playerStatGamesNew n ON (c.PlayerId = n.PlayerId AND c.GameId = n.GameId)
		where
			c.BCS <> n.BCS

		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into #playerStatGamesCopy
		select
			n.*
		from
			#playerStatGamesNew n left join
			#playerStatGamesCopy c on (c.PlayerId = n.PlayerId AND c.GameId = n.GameId)
		where
			c.PlayerId is null

		update #results set NewRecordsInserted = @@ROWCOUNT
	END
	ELSE
	BEGIN
		-- this is not a dry run
		PRINT 'NOT A DRY RUN. UPDATING REAL TABLES'

		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		delete from PlayerStatGames
		from
			PlayerStatGames c LEFT JOIN
			#playerStatGamesNew n ON (c.PlayerId = n.PlayerId AND c.GameId = n.GameId)
		where
			n.GameId is null and
			c.GameId between @StartingGameId and @EndingGameId

		update #results set ExistingRecordsDeleted = @@ROWCOUNT

		update PlayerStatGames
		set
			TeamId = n.TeamId,
			Playoffs = n.Playoffs,
			SeasonId = n.SeasonId,
			Sub = n.Sub,
			Line = n.Line,
			Position = n.Position,
			Goals = n.Goals,
			Assists = n.Assists,
			Points = n.Points,
			PenaltyMinutes = n.PenaltyMinutes,
			PowerPlayGoals = n.PowerPlayGoals,
			ShortHandedGoals = n.ShortHandedGoals,
			GameWinningGoals = n.GameWinningGoals
		from
			PlayerStatGames r INNER JOIN
			#playerStatGamesCopy c ON (r.PlayerId = c.PlayerId AND r.GameId = c.GameId) INNER JOIN
			#playerStatGamesNew n ON (c.PlayerId = n.PlayerId AND c.GameId = n.GameId)
		where
			c.BCS <> n.BCS

		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into PlayerStatGames(PlayerId,
			GameId,
			TeamId,
			Playoffs,
			SeasonId,
			Sub,
			Line,
			Position,
			Goals,
			Assists,
			Points,
			PenaltyMinutes,
			PowerPlayGoals,
			ShortHandedGoals,
			GameWinningGoals)
		select
			n.PlayerId,
			n.GameId,
			n.TeamId,
			n.Playoffs,
			n.SeasonId,
			n.Sub,
			n.Line,
			n.Position,
			n.Goals,
			n.Assists,
			n.Points,
			n.PenaltyMinutes,
			n.PowerPlayGoals,
			n.ShortHandedGoals,
			n.GameWinningGoals
		from
			#playerStatGamesNew n left join
			PlayerStatGames c on (c.PlayerId = n.PlayerId AND c.GameId = n.GameId)
		where
			c.PlayerId is null

		update #results set NewRecordsInserted = @@ROWCOUNT

	END

	update #results set ProcessedRecordsMatchExistingRecords = (select count(*) from #playerStatGamesNew) - NewRecordsInserted - ExistingRecordsUpdated

	select * from #results
END TRY
BEGIN CATCH
    THROW;
END CATCH;
