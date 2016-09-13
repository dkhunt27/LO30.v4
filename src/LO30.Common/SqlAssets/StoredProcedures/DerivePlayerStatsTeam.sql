
--DROP PROCEDURE [dbo].[DerivePlayerStatsTeam]

CREATE PROCEDURE dbo.DerivePlayerStatsTeam
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
	IF OBJECT_ID('tempdb..#playerStatTeamsCopy') IS NOT NULL DROP TABLE #playerStatTeamsCopy
	IF OBJECT_ID('tempdb..#playerStatTeamsNew') IS NOT NULL DROP TABLE #playerStatTeamsNew

	CREATE TABLE #results (
		TableName nvarchar(35) NOT NULL,
		NewRecordsInserted int NOT NULL,
		ExistingRecordsUpdated int NOT NULL,
		ExistingRecordsDeleted int NOT NULL,
		ProcessedRecordsMatchExistingRecords int NOT NULL
	)

	CREATE TABLE #playerStatTeamsNew (
		PlayerId int NOT NULL,
		TeamId int NOT NULL,
		Playoffs bit NOT NULL,
		Sub bit NOT NULL,
		SeasonId int NOT NULL,
		Line int NOT NULL,
		Position nvarchar(1) NOT NULL,
		Games int NOT NULL,
		Goals int NOT NULL,
		Assists int NOT NULL,
		Points int NOT NULL,
		PenaltyMinutes int NOT NULL,
		PowerPlayGoals int NOT NULL,
		ShortHandedGoals int NOT NULL,
		GameWinningGoals int NOT NULL,
		BCS int NULL
	)
	CREATE UNIQUE INDEX PK ON #playerStatTeamsNew(PlayerId, TeamId, Playoffs, Sub)

	CREATE TABLE #playerStatTeamsCopy (
		PlayerId int NOT NULL,
		TeamId int NOT NULL,
		Playoffs bit NOT NULL,
		Sub bit NOT NULL,
		SeasonId int NOT NULL,
		Line int NOT NULL,
		Position nvarchar(1) NOT NULL,
		Games int NOT NULL,
		Goals int NOT NULL,
		Assists int NOT NULL,
		Points int NOT NULL,
		PenaltyMinutes int NOT NULL,
		PowerPlayGoals int NOT NULL,
		ShortHandedGoals int NOT NULL,
		GameWinningGoals int NOT NULL,
		BCS int NULL
	)
	CREATE UNIQUE INDEX PK ON #playerStatTeamsCopy(PlayerId, TeamId, Playoffs, Sub)

	INSERT INTO #results
	SELECT
		'PlayerStatTeams' as TableName,
		0 as NewRecordsInserted,
		0 as ExistingRecordsUpdated,
		0 as ExistingRecordsDeleted,
		0 as ProcessedRecordsMatchExistingRecords


	insert into #playerStatTeamsNew
	select
		s.PlayerId,
		s.TeamId,
		s.Playoffs,
		s.Sub,
		s.SeasonId,
		s.Line,
		s.Position,
		count(s.GameId) as Games,
		sum(s.Goals) as Goals,
		sum(s.Assists) as Assists,
		sum(s.Points) as Points,
		sum(s.PenaltyMinutes) as PenaltyMinutes,
		sum(s.PowerPlayGoals) as PowerPlayGoals,
		sum(s.ShortHandedGoals) as ShortHandedGoals,
		sum(s.GameWinningGoals) as GameWinningGoals,
		NULL as BCS
	from
		PlayerStatGames s
	where
		s.GameId between @StartingGameId and @EndingGameId AND
		s.PlayerId <> 0
	group by
		s.PlayerId,
		s.TeamId,
		s.Playoffs,
		s.SeasonId,
		s.Sub,
		s.Line,
		s.Position


	update #playerStatTeamsNew
	set
		BCS = BINARY_CHECKSUM(PlayerId,
								TeamId,
								Playoffs,
								Sub,
								SeasonId,
								Line,
								Position,
								Games,
								Goals,
								Assists,
								Points,
								PenaltyMinutes,
								PowerPlayGoals,
								ShortHandedGoals,
								GameWinningGoals)

	INSERT INTO #playerStatTeamsCopy
	SELECT 
		PlayerId,
		TeamId,
		Playoffs,
		Sub,
		SeasonId,
		Line,
		Position,
		Games,
		Goals,
		Assists,
		Points,
		PenaltyMinutes,
		PowerPlayGoals,
		ShortHandedGoals,
		GameWinningGoals,
		BINARY_CHECKSUM(PlayerId,
								TeamId,
								Playoffs,
								Sub,
								SeasonId,
								Line,
								Position,
								Games,
								Goals,
								Assists,
								Points,
								PenaltyMinutes,
								PowerPlayGoals,
								ShortHandedGoals,
								GameWinningGoals) as BCS
	FROM 
		PlayerStatTeams


	IF (@dryrun = 1) 
	BEGIN
		-- this is not a dry run
		PRINT 'DRY RUN. NOT UPDATING REAL TABLES'

		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		-- TODO FIGURE OUT HOW TO DO CORRECTLY

		update #playerStatTeamsCopy
		set
			SeasonId = n.SeasonId,
			Line = n.Line,
			Position = n.Position,
			Games = n.Games,
			Goals = n.Goals,
			Assists = n.Assists,
			Points = n.Points,
			PenaltyMinutes = n.PenaltyMinutes,
			PowerPlayGoals = n.PowerPlayGoals,
			ShortHandedGoals = n.ShortHandedGoals,
			GameWinningGoals = n.GameWinningGoals
		from
			#playerStatTeamsCopy c INNER JOIN
			#playerStatTeamsNew n ON (c.PlayerId = n.PlayerId AND c.TeamId = n.TeamId AND c.Playoffs = n.Playoffs AND c.Sub = n.Sub)
		where
			c.BCS <> n.BCS

		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into #playerStatTeamsCopy
		select
			n.*
		from
			#playerStatTeamsNew n left join
			#playerStatTeamsCopy c on (c.PlayerId = n.PlayerId AND c.TeamId = n.TeamId AND c.Playoffs = n.Playoffs AND c.Sub = n.Sub)
		where
			c.PlayerId is null

		update #results set NewRecordsInserted = @@ROWCOUNT
	END
	ELSE
	BEGIN
		-- this is not a dry run
		PRINT 'NOT A DRY RUN. UPDATING REAL TABLES'

		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		-- TODO FIGURE OUT HOW TO DO CORRECTLY

		update PlayerStatTeams
		set
			SeasonId = n.SeasonId,
			Line = n.Line,
			Position = n.Position,
			Games = n.Games,
			Goals = n.Goals,
			Assists = n.Assists,
			Points = n.Points,
			PenaltyMinutes = n.PenaltyMinutes,
			PowerPlayGoals = n.PowerPlayGoals,
			ShortHandedGoals = n.ShortHandedGoals,
			GameWinningGoals = n.GameWinningGoals
		from
			PlayerStatTeams r INNER JOIN
			#playerStatTeamsCopy c ON (r.PlayerId = c.PlayerId AND r.TeamId = c.TeamId AND r.Playoffs = c.Playoffs AND r.Sub = c.Sub) INNER JOIN
			#playerStatTeamsNew n ON (c.PlayerId = n.PlayerId AND c.TeamId = n.TeamId AND c.Playoffs = n.Playoffs AND c.Sub = n.Sub)
		where
			c.BCS <> n.BCS

		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into PlayerStatTeams(PlayerId,
			TeamId,
			Playoffs,
			Sub,
			SeasonId,
			Line,
			Position,
			Games,
			Goals,
			Assists,
			Points,
			PenaltyMinutes,
			PowerPlayGoals,
			ShortHandedGoals,
			GameWinningGoals)
		select
			n.PlayerId,
			n.TeamId,
			n.Playoffs,
			n.Sub,
			n.SeasonId,
			n.Line,
			n.Position,
			n.Games,
			n.Goals,
			n.Assists,
			n.Points,
			n.PenaltyMinutes,
			n.PowerPlayGoals,
			n.ShortHandedGoals,
			n.GameWinningGoals
		from
			#playerStatTeamsNew n left join
			PlayerStatTeams c on (c.PlayerId = n.PlayerId AND c.TeamId = n.TeamId AND c.Playoffs = n.Playoffs AND c.Sub = n.Sub)
		where
			c.PlayerId is null

		update #results set NewRecordsInserted = @@ROWCOUNT

	END

	update #results set ProcessedRecordsMatchExistingRecords = (select count(*) from #playerStatTeamsNew) - NewRecordsInserted - ExistingRecordsUpdated

	select * from #results
END TRY
BEGIN CATCH
    THROW;
END CATCH;
