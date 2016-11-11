
--DROP PROCEDURE [dbo].[DeriveLineStatsTeam]

CREATE PROCEDURE [dbo].[DeriveLineStatsTeam]
	@StartingSeasonId int = 0, 
	@EndingSeasonId int = 0,
	@DryRun int = 0
AS
BEGIN TRY
	SET NOCOUNT ON
/*
-- START comment this out when saving as stored proc
	DECLARE @StartingSeasonId int;
	DECLARE @EndingSeasonId int;
	DECLARE @DryRun int;

	SET @StartingSeasonId = 57;
	SET @EndingSeasonId = 57;

	SET @DryRun = 0;
-- STOP comment this out when saving as stored proc
*/

	IF OBJECT_ID('tempdb..#results') IS NOT NULL DROP TABLE #results
	IF OBJECT_ID('tempdb..#lineStatTeamsCopy') IS NOT NULL DROP TABLE #lineStatTeamsCopy
	IF OBJECT_ID('tempdb..#lineStatTeamsNew') IS NOT NULL DROP TABLE #lineStatTeamsNew

	CREATE TABLE #results (
		TableName nvarchar(35) NOT NULL,
		NewRecordsInserted int NOT NULL,
		ExistingRecordsUpdated int NOT NULL,
		ExistingRecordsDeleted int NOT NULL,
		ProcessedRecordsMatchExistingRecords int NOT NULL
	)

	CREATE TABLE #lineStatTeamsNew (
		TeamId int NOT NULL,
		Line int NOT NULL,
		OpponentTeamId int NOT NULL,
		Playoffs bit NOT NULL,
		SeasonId int NOT NULL,
		Games int NOT NULL,
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
	CREATE UNIQUE INDEX PK ON #lineStatTeamsNew(TeamId, Line, OpponentTeamId, Playoffs)

	CREATE TABLE #lineStatTeamsCopy (
		TeamId int NOT NULL,
		Line int NOT NULL,
		OpponentTeamId int NOT NULL,
		Playoffs bit NOT NULL,
		SeasonId int NOT NULL,
		Games int NOT NULL,
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
	CREATE UNIQUE INDEX PK ON #lineStatTeamsCopy(TeamId, Line, OpponentTeamId, Playoffs)

	INSERT INTO #results
	SELECT
		'LineStatTeams' as TableName,
		0 as NewRecordsInserted,
		0 as ExistingRecordsUpdated,
		0 as ExistingRecordsDeleted,
		0 as ProcessedRecordsMatchExistingRecords


	insert into #lineStatTeamsNew
	select
		s.TeamId,
		s.Line,
		s.OpponentTeamId,
		s.Playoffs,
		s.SeasonId,
		count(s.GameId) as Games,
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
		LineStatGames s
	where
		s.SeasonId between @StartingSeasonId and @EndingSeasonId
	group by
		s.TeamId,
		s.Line,
		s.OpponentTeamId,
		s.Playoffs,
		s.SeasonId


	update #lineStatTeamsNew
	set
		BCS = BINARY_CHECKSUM(TeamId,
								Line,
								OpponentTeamId,
								Playoffs,
								SeasonId,
								Games,
								Goals,
								Assists,
								Points,
								PenaltyMinutes,
								PowerPlayGoals,
								ShortHandedGoals,
								GameWinningGoals,
								GoalsAgainst)

	INSERT INTO #lineStatTeamsCopy
	SELECT 
		TeamId,
		Line,
		OpponentTeamId,
		Playoffs,
		SeasonId,
		Games,
		Goals,
		Assists,
		Points,
		PenaltyMinutes,
		PowerPlayGoals,
		ShortHandedGoals,
		GameWinningGoals,
		GoalsAgainst,
		BINARY_CHECKSUM(TeamId,
								Line,
								OpponentTeamId,
								Playoffs,
								SeasonId,
								Games,
								Goals,
								Assists,
								Points,
								PenaltyMinutes,
								PowerPlayGoals,
								ShortHandedGoals,
								GameWinningGoals,
								GoalsAgainst) as BCS
	FROM 
		LineStatTeams


	IF (@dryrun = 1) 
	BEGIN
		-- this is not a dry run
		PRINT 'DRY RUN. NOT UPDATING REAL TABLES'

		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		delete from #lineStatTeamsCopy
		from
			#lineStatTeamsCopy c left join
			#lineStatTeamsNew n on (c.TeamId = n.TeamId AND c.Line = n.Line AND c.OpponentTeamId = n.OpponentTeamId AND c.Playoffs = n.Playoffs)
		where
			n.TeamId is null AND
			c.SeasonId between @StartingSeasonId and @EndingSeasonId

		update #results set ExistingRecordsDeleted = @@ROWCOUNT

		update #lineStatTeamsCopy
		set
			SeasonId = n.SeasonId,
			Games = n.Games,
			Goals = n.Goals,
			Assists = n.Assists,
			Points = n.Points,
			PenaltyMinutes = n.PenaltyMinutes,
			PowerPlayGoals = n.PowerPlayGoals,
			ShortHandedGoals = n.ShortHandedGoals,
			GameWinningGoals = n.GameWinningGoals,
			GoalsAgainst = n.GoalsAgainst
		from
			#lineStatTeamsCopy c INNER JOIN
			#lineStatTeamsNew n ON (c.TeamId = n.TeamId AND c.Line = n.Line AND c.OpponentTeamId = n.OpponentTeamId AND c.Playoffs = n.Playoffs)
		where
			c.BCS <> n.BCS

		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into #lineStatTeamsCopy
		select
			n.*
		from
			#lineStatTeamsNew n left join
			#lineStatTeamsCopy c on (c.TeamId = n.TeamId AND c.Line = n.Line AND c.OpponentTeamId = n.OpponentTeamId AND c.Playoffs = n.Playoffs)
		where
			c.TeamId is null

		update #results set NewRecordsInserted = @@ROWCOUNT
	END
	ELSE
	BEGIN
		-- this is not a dry run
		PRINT 'NOT A DRY RUN. UPDATING REAL TABLES'

		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		delete from LineStatTeams
		from
			LineStatTeams c left join
			#lineStatTeamsNew n on (c.TeamId = n.TeamId AND c.Line = n.Line AND c.OpponentTeamId = n.OpponentTeamId AND c.Playoffs = n.Playoffs)
		where
			n.TeamId is null AND
			c.SeasonId between @StartingSeasonId and @EndingSeasonId

		update #results set ExistingRecordsDeleted = @@ROWCOUNT

		update LineStatTeams
		set
			SeasonId = n.SeasonId,
			Games = n.Games,
			Goals = n.Goals,
			Assists = n.Assists,
			Points = n.Points,
			PenaltyMinutes = n.PenaltyMinutes,
			PowerPlayGoals = n.PowerPlayGoals,
			ShortHandedGoals = n.ShortHandedGoals,
			GameWinningGoals = n.GameWinningGoals,
			GoalsAgainst = n.GoalsAgainst
		from
			LineStatTeams r INNER JOIN
			#lineStatTeamsCopy c ON (r.TeamId = c.TeamId AND r.Line = c.Line AND r.OpponentTeamId = c.OpponentTeamId AND r.Playoffs = c.Playoffs) INNER JOIN
			#lineStatTeamsNew n ON (c.TeamId = n.TeamId AND c.Line = n.Line AND c.OpponentTeamId = n.OpponentTeamId AND c.Playoffs = n.Playoffs)
		where
			c.BCS <> n.BCS

		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into LineStatTeams(TeamId,
			Line,
			OpponentTeamId,
			Playoffs,
			SeasonId,
			Games,
			Goals,
			Assists,
			Points,
			PenaltyMinutes,
			PowerPlayGoals,
			ShortHandedGoals,
			GameWinningGoals,
			GoalsAgainst)
		select
			n.TeamId,
			n.Line,
			n.OpponentTeamId,
			n.Playoffs,
			n.SeasonId,
			n.Games,
			n.Goals,
			n.Assists,
			n.Points,
			n.PenaltyMinutes,
			n.PowerPlayGoals,
			n.ShortHandedGoals,
			n.GameWinningGoals,
			n.GoalsAgainst
		from
			#lineStatTeamsNew n left join
			LineStatTeams c on (c.TeamId = n.TeamId AND c.Line = n.Line AND c.OpponentTeamId = n.OpponentTeamId AND c.Playoffs = n.Playoffs)
		where
			c.TeamId is null

		update #results set NewRecordsInserted = @@ROWCOUNT

	END

	update #results set ProcessedRecordsMatchExistingRecords = (select count(*) from #lineStatTeamsNew) - NewRecordsInserted - ExistingRecordsUpdated

	select * from #results
END TRY
BEGIN CATCH
    THROW;
END CATCH;
