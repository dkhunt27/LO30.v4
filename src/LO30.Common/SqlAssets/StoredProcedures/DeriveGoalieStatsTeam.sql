
--DROP PROCEDURE [dbo].[DeriveGoalieStatsTeam]

CREATE PROCEDURE [dbo].[DeriveGoalieStatsTeam]
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
	IF OBJECT_ID('tempdb..#goalieStatTeamsCopy') IS NOT NULL DROP TABLE #goalieStatTeamsCopy
	IF OBJECT_ID('tempdb..#goalieStatTeamsNew') IS NOT NULL DROP TABLE #goalieStatTeamsNew

	CREATE TABLE #results (
		TableName nvarchar(35) NOT NULL,
		NewRecordsInserted int NOT NULL,
		ExistingRecordsUpdated int NOT NULL,
		ExistingRecordsDeleted int NOT NULL,
		ProcessedRecordsMatchExistingRecords int NOT NULL
	)

	CREATE TABLE #goalieStatTeamsNew (
		PlayerId int NOT NULL,
		TeamId int NOT NULL,
		Playoffs bit NOT NULL,
		Sub bit NOT NULL,
		SeasonId int NOT NULL,
		Games int NOT NULL,
		GoalsAgainst int NOT NULL,
		Shutouts int NOT NULL,
		Wins int NOT NULL,
		BCS int NULL
	)
	CREATE UNIQUE INDEX PK ON #goalieStatTeamsNew(PlayerId, TeamId, Playoffs, Sub)

	CREATE TABLE #goalieStatTeamsCopy (
		PlayerId int NOT NULL,
		TeamId int NOT NULL,
		Playoffs bit NOT NULL,
		Sub bit NOT NULL,
		SeasonId int NOT NULL,
		Games int NOT NULL,
		GoalsAgainst int NOT NULL,
		Shutouts int NOT NULL,
		Wins int NOT NULL,
		BCS int NULL
	)
	CREATE UNIQUE INDEX PK ON #goalieStatTeamsCopy(PlayerId, TeamId, Playoffs, Sub)

	INSERT INTO #results
	SELECT
		'GoalieStatTeams' as TableName,
		0 as NewRecordsInserted,
		0 as ExistingRecordsUpdated,
		0 as ExistingRecordsDeleted,
		0 as ProcessedRecordsMatchExistingRecords


	insert into #goalieStatTeamsNew
	select
		s.PlayerId,
		s.TeamId,
		s.Playoffs,
		s.Sub,
		s.SeasonId,
		count(s.GameId) as Games,
		sum(s.GoalsAgainst) as GoalsAgainst,
		sum(s.Shutouts) as Shutouts,
		sum(s.Wins) as Wins,
		NULL as BCS
	from
		GoalieStatGames s
	where
		s.SeasonId between @StartingSeasonId and @EndingSeasonId AND
		s.PlayerId > 0
	group by
		s.PlayerId,
		s.TeamId,
		s.Playoffs,
		s.SeasonId,
		s.Sub

	update #goalieStatTeamsNew
	set
		BCS = BINARY_CHECKSUM(PlayerId,
								TeamId,
								Playoffs,
								Sub,
								SeasonId,
								Games,
								GoalsAgainst,
								Shutouts,
								Wins)

	INSERT INTO #goalieStatTeamsCopy
	SELECT 
		PlayerId,
		TeamId,
		Playoffs,
		Sub,
		SeasonId,
		Games,
		GoalsAgainst,
		Shutouts,
		Wins,
		BINARY_CHECKSUM(PlayerId,
								TeamId,
								Playoffs,
								Sub,
								SeasonId,
								Games,
								GoalsAgainst,
								Shutouts,
								Wins) as BCS
	FROM 
		GoalieStatTeams


	IF (@dryrun = 1) 
	BEGIN
		-- this is not a dry run
		PRINT 'DRY RUN. NOT UPDATING REAL TABLES'

		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		delete from #goalieStatTeamsCopy
		from
			#goalieStatTeamsCopy c left join
			#goalieStatTeamsNew n on (c.PlayerId = n.PlayerId AND c.TeamId = n.TeamId AND c.Playoffs = n.Playoffs AND c.Sub = n.Sub)
		where
			n.PlayerId is null AND
			c.SeasonId between @StartingSeasonId and @EndingSeasonId

		update #results set ExistingRecordsDeleted = @@ROWCOUNT

		update #goalieStatTeamsCopy
		set
			SeasonId = n.SeasonId,
			Games = n.Games,
			GoalsAgainst = n.GoalsAgainst,
			Shutouts = n.Shutouts,
			Wins = n.Wins
		from
			#goalieStatTeamsCopy c INNER JOIN
			#goalieStatTeamsNew n ON (c.PlayerId = n.PlayerId AND c.TeamId = n.TeamId AND c.Playoffs = n.Playoffs AND c.Sub = n.Sub)
		where
			c.BCS <> n.BCS

		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into #goalieStatTeamsCopy
		select
			n.*
		from
			#goalieStatTeamsNew n left join
			#goalieStatTeamsCopy c on (c.PlayerId = n.PlayerId AND c.TeamId = n.TeamId AND c.Playoffs = n.Playoffs AND c.Sub = n.Sub)
		where
			c.PlayerId is null

		update #results set NewRecordsInserted = @@ROWCOUNT
	END
	ELSE
	BEGIN
		-- this is not a dry run
		PRINT 'NOT A DRY RUN. UPDATING REAL TABLES'

		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		delete from GoalieStatTeams
		from
			GoalieStatTeams c left join
			#goalieStatTeamsNew n on (c.PlayerId = n.PlayerId AND c.TeamId = n.TeamId AND c.Playoffs = n.Playoffs AND c.Sub = n.Sub)
		where
			n.PlayerId is null AND
			c.SeasonId between @StartingSeasonId and @EndingSeasonId

		update #results set ExistingRecordsDeleted = @@ROWCOUNT

		update GoalieStatTeams
		set
			SeasonId = n.SeasonId,
			Games = n.Games,
			GoalsAgainst = n.GoalsAgainst,
			Shutouts = n.Shutouts,
			Wins = n.Wins
		from
			GoalieStatTeams r INNER JOIN
			#goalieStatTeamsCopy c ON (r.PlayerId = c.PlayerId AND r.TeamId = c.TeamId AND r.Playoffs = c.Playoffs AND r.Sub = c.Sub) INNER JOIN
			#goalieStatTeamsNew n ON (c.PlayerId = n.PlayerId AND c.TeamId = n.TeamId AND c.Playoffs = n.Playoffs AND c.Sub = n.Sub)
		where
			c.BCS <> n.BCS

		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into GoalieStatTeams(PlayerId,
			TeamId,
			Playoffs,
			Sub,
			SeasonId,
			Games,
			GoalsAgainst,
			Shutouts,
			Wins)
		select
			n.PlayerId,
			n.TeamId,
			n.Playoffs,
			n.Sub,
			n.SeasonId,
			n.Games,
			n.GoalsAgainst,
			n.Shutouts,
			n.Wins
		from
			#goalieStatTeamsNew n left join
			GoalieStatTeams c on (c.PlayerId = n.PlayerId AND c.TeamId = n.TeamId AND c.Playoffs = n.Playoffs AND c.Sub = n.Sub)
		where
			c.PlayerId is null

		update #results set NewRecordsInserted = @@ROWCOUNT

	END

	update #results set ProcessedRecordsMatchExistingRecords = (select count(*) from #goalieStatTeamsNew) - NewRecordsInserted - ExistingRecordsUpdated

	select * from #results
END TRY
BEGIN CATCH
    THROW;
END CATCH;