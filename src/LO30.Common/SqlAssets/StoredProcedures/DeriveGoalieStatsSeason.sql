﻿
--DROP PROCEDURE [dbo].[DeriveGoalieStatsSeason]

CREATE PROCEDURE dbo.DeriveGoalieStatsSeason
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

	SET @StartingSeasonId = 54;
	SET @EndingSeasonId = 54;

	SET @DryRun = 0;
-- STOP comment this out when saving as stored proc
*/

	IF OBJECT_ID('tempdb..#results') IS NOT NULL DROP TABLE #results
	IF OBJECT_ID('tempdb..#goalieStatSeasonsCopy') IS NOT NULL DROP TABLE #goalieStatSeasonsCopy
	IF OBJECT_ID('tempdb..#goalieStatSeasonsNew') IS NOT NULL DROP TABLE #goalieStatSeasonsNew

	CREATE TABLE #results (
		TableName nvarchar(35) NOT NULL,
		NewRecordsInserted int NOT NULL,
		ExistingRecordsUpdated int NOT NULL,
		ExistingRecordsDeleted int NOT NULL,
		ProcessedRecordsMatchExistingRecords int NOT NULL
	)

	CREATE TABLE #goalieStatSeasonsNew (
		PlayerId int NOT NULL,
		SeasonId int NOT NULL,
		Playoffs bit NOT NULL,
		Sub bit NOT NULL,
		Games int NOT NULL,
		GoalsAgainst int NOT NULL,
		Shutouts int NOT NULL,
		Wins int NOT NULL,
		BCS int NULL
	)
	CREATE UNIQUE INDEX PK ON #goalieStatSeasonsNew(PlayerId, SeasonId, Playoffs, Sub)

	CREATE TABLE #goalieStatSeasonsCopy (
		PlayerId int NOT NULL,
		SeasonId int NOT NULL,
		Playoffs bit NOT NULL,
		Sub bit NOT NULL,
		Games int NOT NULL,
		GoalsAgainst int NOT NULL,
		Shutouts int NOT NULL,
		Wins int NOT NULL,
		BCS int NULL
	)
	CREATE UNIQUE INDEX PK ON #goalieStatSeasonsCopy(PlayerId, SeasonId, Playoffs, Sub)

	INSERT INTO #results
	SELECT
		'GoalieStatSeasons' as TableName,
		0 as NewRecordsInserted,
		0 as ExistingRecordsUpdated,
		0 as ExistingRecordsDeleted,
		0 as ProcessedRecordsMatchExistingRecords


	insert into #goalieStatSeasonsNew
	select
		s.PlayerId,
		s.SeasonId,
		s.Playoffs,
		0 as Sub,  -- TODO ESSENTIALLY REMOVING THIS FIELD UNTIL REMOVED FROM TABLE DIRECTLY
		sum(s.Games) as Games,
		sum(s.GoalsAgainst) as GoalsAgainst,
		sum(s.Shutouts) as Shutouts,
		sum(s.Wins) as Wins,
		NULL as BCS
	from
		GoalieStatTeams s
	where
		s.SeasonId between @StartingSeasonId and @EndingSeasonId AND
		s.PlayerId <> 0
	group by
		s.PlayerId,
		s.SeasonId,
		s.Playoffs


	update #goalieStatSeasonsNew
	set
		BCS = BINARY_CHECKSUM(PlayerId,
								SeasonId,
								Playoffs,
								Sub,
								Games,
								GoalsAgainst,
								Shutouts,
								Wins)

	INSERT INTO #goalieStatSeasonsCopy
	SELECT 
		PlayerId,
		SeasonId,
		Playoffs,
		Sub,
		Games,
		GoalsAgainst,
		Shutouts,
		Wins,
		BINARY_CHECKSUM(PlayerId,
								SeasonId,
								Playoffs,
								Sub,
								Games,
								GoalsAgainst,
								Shutouts,
								Wins) as BCS
	FROM 
		GoalieStatSeasons


	IF (@dryrun = 1) 
	BEGIN
		-- this is not a dry run
		PRINT 'DRY RUN. NOT UPDATING REAL TABLES'

		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		-- TODO FIGURE OUT HOW TO DO CORRECTLY

		update #goalieStatSeasonsCopy
		set
			Games = n.Games,
			GoalsAgainst = n.GoalsAgainst,
			Shutouts = n.Shutouts,
			Wins = n.Wins
		from
			#goalieStatSeasonsCopy c INNER JOIN
			#goalieStatSeasonsNew n ON (c.PlayerId = n.PlayerId AND c.SeasonId = n.SeasonId AND c.Playoffs = n.Playoffs AND c.Sub = n.Sub)
		where
			c.BCS <> n.BCS

		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into #goalieStatSeasonsCopy
		select
			n.*
		from
			#goalieStatSeasonsNew n left join
			#goalieStatSeasonsCopy c on (c.PlayerId = n.PlayerId AND c.SeasonId = n.SeasonId AND c.Playoffs = n.Playoffs AND c.Sub = n.Sub)
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

		update GoalieStatSeasons
		set
			Games = n.Games,
			GoalsAgainst = n.GoalsAgainst,
			Shutouts = n.Shutouts,
			Wins = n.Wins
		from
			GoalieStatSeasons r INNER JOIN
			#goalieStatSeasonsCopy c ON (r.PlayerId = c.PlayerId AND r.SeasonId = c.SeasonId AND r.Playoffs = c.Playoffs AND r.Sub = c.Sub) INNER JOIN
			#goalieStatSeasonsNew n ON (c.PlayerId = n.PlayerId AND c.SeasonId = n.SeasonId AND c.Playoffs = n.Playoffs AND c.Sub = n.Sub)
		where
			c.BCS <> n.BCS

		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into GoalieStatSeasons
		select
			n.PlayerId,
			n.SeasonId,
			n.Playoffs,
			n.Sub,
			n.Games,
			n.GoalsAgainst,
			n.Shutouts,
			n.Wins,
			GETDATE()
		from
			#goalieStatSeasonsNew n left join
			GoalieStatSeasons c on (c.PlayerId = n.PlayerId AND c.SeasonId = n.SeasonId AND c.Playoffs = n.Playoffs AND c.Sub = n.Sub)
		where
			c.PlayerId is null

		update #results set NewRecordsInserted = @@ROWCOUNT

	END

	update #results set ProcessedRecordsMatchExistingRecords = (select count(*) from #goalieStatSeasonsNew) - NewRecordsInserted - ExistingRecordsUpdated

	select * from #results
END TRY
BEGIN CATCH
    THROW;
END CATCH;
