
--DROP PROCEDURE [dbo].[DeriveLineStatsGame]

CREATE PROCEDURE [dbo].[DeriveLineStatsGame]
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

	SET @StartingGameId = 3664;
	--SET @EndingGameId = 3319;

	--SET @StartingGameId = 3324;
	SET @EndingGameId = 3667;

	SET @DryRun = 1;
-- STOP comment this out when saving as stored proc
*/

	IF OBJECT_ID('tempdb..#results') IS NOT NULL DROP TABLE #results
	IF OBJECT_ID('tempdb..#statsDetail') IS NOT NULL DROP TABLE #statsDetail
	IF OBJECT_ID('tempdb..#lineStatGamesNew') IS NOT NULL DROP TABLE #lineStatGamesNew
	IF OBJECT_ID('tempdb..#lineStatGamesCopy') IS NOT NULL DROP TABLE #lineStatGamesCopy
	IF OBJECT_ID('tempdb..#lines') IS NOT NULL DROP TABLE #lines

	CREATE TABLE #results (
		TableName nvarchar(35) NOT NULL,
		NewRecordsInserted int NOT NULL,
		ExistingRecordsUpdated int NOT NULL,
		ExistingRecordsDeleted int NOT NULL,
		ProcessedRecordsMatchExistingRecords int NOT NULL
	)

	CREATE TABLE #lines (
		Line int NOT NULL
	)
	CREATE UNIQUE INDEX PK ON #lines(Line)

	CREATE TABLE #statsDetail (
		GameId int NOT NULL,
		TeamId int NOT NULL,
		Line int NOT NULL,
		Playoffs bit NOT NULL,
		SeasonId int NOT NULL,
		Goals int NOT NULL,
		Assists int NOT NULL,
		Points int NOT NULL,
		PenaltyMinutes int NOT NULL,
		PowerPlayGoals int NOT NULL,
		ShortHandedGoals int NOT NULL,
		GameWinningGoals int NOT NULL,
		GoalsAgainst int NOT NULL
	)

	CREATE TABLE #lineStatGamesNew (
		GameId int NOT NULL,
		TeamId int NOT NULL,
		Line int NOT NULL,
		OpponentTeamId int NOT NULL,
		Playoffs bit NOT NULL,
		SeasonId int NOT NULL,
		Goals int NOT NULL,
		Assists int NOT NULL,
		Points int NOT NULL,
		PenaltyMinutes int NOT NULL,
		PowerPlayGoals int NOT NULL,
		ShortHandedGoals int NOT NULL,
		GameWinningGoals int NOT NULL,
		GoalsAgainst int NOT NULL,
		BCS int NULL
	)
	CREATE UNIQUE INDEX PK ON #lineStatGamesNew(GameId, TeamId, Line)

	CREATE TABLE #lineStatGamesCopy (
		GameId int NOT NULL,
		TeamId int NOT NULL,
		Line int NOT NULL,
		OpponentTeamId int NOT NULL,
		Playoffs bit NOT NULL,
		SeasonId int NOT NULL,
		Goals int NOT NULL,
		Assists int NOT NULL,
		Points int NOT NULL,
		PenaltyMinutes int NOT NULL,
		PowerPlayGoals int NOT NULL,
		ShortHandedGoals int NOT NULL,
		GameWinningGoals int NOT NULL,
		GoalsAgainst int NOT NULL,
		BCS int NULL
	)
	CREATE UNIQUE INDEX PK ON #lineStatGamesCopy(GameId, TeamId, Line)

	INSERT INTO #results
	SELECT
		'LineStatGames' as TableName,
		0 as NewRecordsInserted,
		0 as ExistingRecordsUpdated,
		0 as ExistingRecordsDeleted,
		0 as ProcessedRecordsMatchExistingRecords

	INSERT INTO #lines SELECT 1
	INSERT INTO #lines SELECT 2
	INSERT INTO #lines SELECT 3

	-- insert record for games played, for games without points
	insert into #statsDetail
	select
		g.GameId,
		gt.TeamId,
		l.Line,
		g.Playoffs,
		g.SeasonId,
		0 as Goals,
		0 as Assists,
		0 as Points,
		0 as PenaltyMinutes,
		0 as PowerPlayGoals,
		0 as ShortHandedGoals,
		0 as GameWinningGoals,
		0 as GoalsAgainst
	from
		Games g inner join
		GameTeams gt on (g.GameId = gt.GameId) cross join
		#lines l
	where
		g.GameId between @StartingGameId and @EndingGameId

	insert into #statsDetail
	select
		ssepg.GameId,
		ssepg.TeamId,
		gr.Line,
		g.Playoffs,
		ssepg.SeasonId,
		1 as Goals,
		0 as Assists,
		1 as Points,
		0 as PenaltyMinutes,
		convert(int,ssepg.PowerPlayGoal) as PowerPlayGoals,
		convert(int,ssepg.ShortHandedGoal) as ShortHandedGoals,
		convert(int,ssepg.GameWinningGoal) as GameWinningGoals,
		0 as GoalsAgainst
	from
		ScoreSheetEntryProcessedGoals ssepg inner join
		GameRosters gr on (ssepg.GameId = gr.GameId AND ssepg.TeamId = gr.TeamId AND ssepg.GoalPlayerId = gr.PlayerId) inner join
		Games g on (ssepg.GameId = g.GameId)
	where
		ssepg.GameId between @StartingGameId and @EndingGameId

	insert into #statsDetail
	select
		ssepg.GameId,
		gt.OpponentTeamId,
		gr.Line,
		g.Playoffs,
		ssepg.SeasonId,
		0 as Goals,
		0 as Assists,
		0 as Points,
		0 as PenaltyMinutes,
		0 as PowerPlayGoals,
		0 as ShortHandedGoals,
		0 as GameWinningGoals,
		1 as GoalsAgainst
	from
		ScoreSheetEntryProcessedGoals ssepg inner join
		GameRosters gr on (ssepg.GameId = gr.GameId AND ssepg.TeamId = gr.TeamId AND ssepg.GoalPlayerId = gr.PlayerId) inner join
		Games g on (ssepg.GameId = g.GameId) INNER JOIN
		GameTeams gt ON (gr.GameId = gt.GameId AND gr.TeamId = gt.TeamId)
	where
		ssepg.GameId between @StartingGameId and @EndingGameId

	insert into #statsDetail
	select
		ssepg.GameId,
		ssepg.TeamId,
		gr.Line,
		g.Playoffs,
		ssepg.SeasonId,
		0 as Goals,
		1 as Assists,
		1 as Points,
		0 as PenaltyMinutes,
		0 as PowerPlayGoals,
		0 as ShortHandedGoals,
		0 as GameWinningGoals,
		0 as GoalsAgainst
	from
		ScoreSheetEntryProcessedGoals ssepg inner join
		GameRosters gr on (ssepg.GameId = gr.GameId AND ssepg.TeamId = gr.TeamId AND ssepg.Assist1PlayerId = gr.PlayerId) inner join
		Games g on (ssepg.GameId = g.GameId)
	where
		ssepg.GameId between @StartingGameId and @EndingGameId


	insert into #statsDetail
	select
		ssepg.GameId,
		ssepg.TeamId,
		gr.Line,
		g.Playoffs,
		ssepg.SeasonId,
		0 as Goals,
		1 as Assists,
		1 as Points,
		0 as PenaltyMinutes,
		0 as PowerPlayGoals,
		0 as ShortHandedGoals,
		0 as GameWinningGoals,
		0 as GoalsAgainst
	from
		ScoreSheetEntryProcessedGoals ssepg inner join
		GameRosters gr on (ssepg.GameId = gr.GameId AND ssepg.TeamId = gr.TeamId AND ssepg.Assist2PlayerId = gr.PlayerId) inner join
		Games g on (ssepg.GameId = g.GameId)
	where
		ssepg.GameId between @StartingGameId and @EndingGameId

	insert into #statsDetail
	select
		ssepg.GameId,
		ssepg.TeamId,
		gr.Line,
		g.Playoffs,
		ssepg.SeasonId,
		0 as Goals,
		1 as Assists,
		1 as Points,
		0 as PenaltyMinutes,
		0 as PowerPlayGoals,
		0 as ShortHandedGoals,
		0 as GameWinningGoals,
		0 as GoalsAgainst
	from
		ScoreSheetEntryProcessedGoals ssepg inner join
		GameRosters gr on (ssepg.GameId = gr.GameId AND ssepg.TeamId = gr.TeamId AND ssepg.Assist3PlayerId = gr.PlayerId) inner join
		Games g on (ssepg.GameId = g.GameId)
	where
		ssepg.GameId between @StartingGameId and @EndingGameId

	insert into #statsDetail
	select
		ssepp.GameId,
		ssepp.TeamId,
		gr.Line,
		g.Playoffs,
		ssepp.SeasonId,
		0 as Goals,
		0 as Assists,
		0 as Points,
		ssepp.PenaltyMinutes,
		0 as PowerPlayGoals,
		0 as ShortHandedGoals,
		0 as GameWinningGoals,
		0 as GoalsAgainst
	from
		ScoreSheetEntryProcessedPenalties ssepp inner join
		GameRosters gr on (ssepp.GameId = gr.GameId AND ssepp.TeamId = gr.TeamId AND ssepp.PlayerId = gr.PlayerId) inner join
		Games g on (ssepp.GameId = g.GameId)
	where
		ssepp.GameId between @StartingGameId and @EndingGameId


	insert into #lineStatGamesNew
	select
		s.GameId,
		s.TeamId,
		s.Line,
		gt.OpponentTeamId,
		s.Playoffs,
		s.SeasonId,
		sum(s.Goals) as Goals,
		sum(s.Assists) as Assists,
		sum(s.Points) as Points,
		sum(s.PenaltyMinutes) as PenaltyMinutes,
		sum(s.PowerPlayGoals) as PowerPlayGoals,
		sum(s.ShortHandedGoals) as ShortHandedGoals,
		sum(s.GameWinningGoals) as GameWinningGoals,
		sum(s.GoalsAgainst) as GoalsAgainst,
		NULL as BCS
	from
		#statsDetail s INNER JOIN
		GameTeams gt ON (s.GameId = gt.GameId AND s.TeamId = gt.TeamId)
	group by
		s.GameId,
		s.TeamId,
		s.Line,
		gt.OpponentTeamId,
		s.Playoffs,
		s.SeasonId

	update #lineStatGamesNew
	set
		BCS = BINARY_CHECKSUM(GameId,
								TeamId,
								Line,
								OpponentTeamId,
								Playoffs,
								SeasonId,
								Goals,
								Assists,
								Points,
								PenaltyMinutes,
								PowerPlayGoals,
								ShortHandedGoals,
								GameWinningGoals,
								GoalsAgainst)


	INSERT INTO #lineStatGamesCopy
	SELECT 
		GameId,
		TeamId,
		Line,
		OpponentTeamId,
		Playoffs,
		SeasonId,
		Goals,
		Assists,
		Points,
		PenaltyMinutes,
		PowerPlayGoals,
		ShortHandedGoals,
		GameWinningGoals,
		GoalsAgainst,
		BINARY_CHECKSUM(GameId,
								TeamId,
								Line,
								OpponentTeamId,
								Playoffs,
								SeasonId,
								Goals,
								Assists,
								Points,
								PenaltyMinutes,
								PowerPlayGoals,
								ShortHandedGoals,
								GameWinningGoals,
								GoalsAgainst) as BCS
	FROM 
		LineStatGames


	IF (@dryrun = 1) 
	BEGIN
		-- this is not a dry run
		PRINT 'DRY RUN. NOT UPDATING REAL TABLES'
		
		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		delete from #lineStatGamesCopy
		from
			#lineStatGamesCopy c left join
			#lineStatGamesNew n on (c.GameId = n.GameId AND c.TeamId = n.TeamId AND c.Line = n.Line)
		where
			n.GameId is null and
			c.GameId between @StartingGameId and @EndingGameId

		update #results set ExistingRecordsDeleted = @@ROWCOUNT

		update #lineStatGamesCopy
		set
			OpponentTeamId = n.OpponentTeamId,
			Playoffs = n.Playoffs,
			SeasonId = n.SeasonId,
			Goals = n.Goals,
			Assists = n.Assists,
			Points = n.Points,
			PenaltyMinutes = n.PenaltyMinutes,
			PowerPlayGoals = n.PowerPlayGoals,
			ShortHandedGoals = n.ShortHandedGoals,
			GameWinningGoals = n.GameWinningGoals,
			GoalsAgainst = n.GoalsAgainst
		from
			#lineStatGamesCopy c INNER JOIN
			#lineStatGamesNew n ON (c.GameId = n.GameId AND c.TeamId = n.TeamId AND c.Line = n.Line)
		where
			c.BCS <> n.BCS

		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into #lineStatGamesCopy
		select
			n.*
		from
			#lineStatGamesNew n left join
			#lineStatGamesCopy c on (c.GameId = n.GameId AND c.TeamId = n.TeamId AND c.Line = n.Line)
		where
			c.GameId is null

		update #results set NewRecordsInserted = @@ROWCOUNT
	END
	ELSE
	BEGIN
		-- this is not a dry run
		PRINT 'NOT A DRY RUN. UPDATING REAL TABLES'

		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		delete from LineStatGames
		from
			#lineStatGamesCopy c left join
			LineStatGames n on (c.GameId = n.GameId AND c.TeamId = n.TeamId AND c.Line = n.Line)
		where
			n.GameId is null and
			c.GameId between @StartingGameId and @EndingGameId

		update #results set ExistingRecordsDeleted = @@ROWCOUNT

		update LineStatGames
		set
			OpponentTeamId = n.OpponentTeamId,
			Playoffs = n.Playoffs,
			SeasonId = n.SeasonId,
			Goals = n.Goals,
			Assists = n.Assists,
			Points = n.Points,
			PenaltyMinutes = n.PenaltyMinutes,
			PowerPlayGoals = n.PowerPlayGoals,
			ShortHandedGoals = n.ShortHandedGoals,
			GameWinningGoals = n.GameWinningGoals,
			GoalsAgainst = n.GoalsAgainst
		from
			LineStatGames r INNER JOIN
			#lineStatGamesCopy c ON (r.GameId = c.GameId AND r.TeamId = c.TeamId AND r.Line = c.Line) INNER JOIN
			#lineStatGamesNew n ON (c.GameId = n.GameId AND c.TeamId = n.TeamId AND c.Line = n.Line)
		where
			c.BCS <> n.BCS

		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into LineStatGames(GameId,
			TeamId,
			Line,
			OpponentTeamId,
			Playoffs,
			SeasonId,
			Goals,
			Assists,
			Points,
			PenaltyMinutes,
			PowerPlayGoals,
			ShortHandedGoals,
			GameWinningGoals,
			GoalsAgainst)
		select
			n.GameId,
			n.TeamId,
			n.Line,
			n.OpponentTeamId,
			n.Playoffs,
			n.SeasonId,
			n.Goals,
			n.Assists,
			n.Points,
			n.PenaltyMinutes,
			n.PowerPlayGoals,
			n.ShortHandedGoals,
			n.GameWinningGoals,
			n.GoalsAgainst
		from
			#lineStatGamesNew n left join
			LineStatGames c on (c.GameId = n.GameId AND c.TeamId = n.TeamId AND c.Line = n.Line)
		where
			c.GameId is null

		update #results set NewRecordsInserted = @@ROWCOUNT

	END

	update #results set ProcessedRecordsMatchExistingRecords = (select count(*) from #lineStatGamesNew) - NewRecordsInserted - ExistingRecordsUpdated

	select * from #results
END TRY
BEGIN CATCH
    THROW;
END CATCH;

