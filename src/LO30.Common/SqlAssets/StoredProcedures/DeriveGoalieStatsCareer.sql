
--DROP PROCEDURE [dbo].[DeriveGoalieStatsCareer]

CREATE PROCEDURE [dbo].[DeriveGoalieStatsCareer]
	@DryRun int = 0
AS
BEGIN TRY
	SET NOCOUNT ON
/*
-- START comment this out when saving as stored proc
	DECLARE @DryRun int;

	SET @DryRun = 0;
-- STOP comment this out when saving as stored proc
*/

	IF OBJECT_ID('tempdb..#results') IS NOT NULL DROP TABLE #results
	IF OBJECT_ID('tempdb..#goalieStatCareersCopy') IS NOT NULL DROP TABLE #goalieStatCareersCopy
	IF OBJECT_ID('tempdb..#goalieStatCareersNew') IS NOT NULL DROP TABLE #goalieStatCareersNew

	CREATE TABLE #results (
		TableName nvarchar(35) NOT NULL,
		NewRecordsInserted int NOT NULL,
		ExistingRecordsUpdated int NOT NULL,
		ExistingRecordsDeleted int NOT NULL,
		ProcessedRecordsMatchExistingRecords int NOT NULL
	)

	CREATE TABLE #goalieStatCareersNew (
		PlayerId int NOT NULL,
		Seasons int NOT NULL,
		Games int NOT NULL,
		GoalsAgainst int NOT NULL,
		Shutouts int NOT NULL,
		Wins int NOT NULL,
		BCS int NULL
	)
	CREATE UNIQUE INDEX PK ON #goalieStatCareersNew(PlayerId)

	CREATE TABLE #goalieStatCareersCopy (
		PlayerId int NOT NULL,
		Seasons int NOT NULL,
		Games int NOT NULL,
		GoalsAgainst int NOT NULL,
		Shutouts int NOT NULL,
		Wins int NOT NULL,
		BCS int NULL
	)
	CREATE UNIQUE INDEX PK ON #goalieStatCareersCopy(PlayerId)

	INSERT INTO #results
	SELECT
		'GoalieStatCareers' as TableName,
		0 as NewRecordsInserted,
		0 as ExistingRecordsUpdated,
		0 as ExistingRecordsDeleted,
		0 as ProcessedRecordsMatchExistingRecords


	insert into #goalieStatCareersNew
	select
		s.PlayerId,
		count(distinct s.SeasonId) as Seasons,
		sum(s.Games) as Games,
		sum(s.GoalsAgainst) as GoalsAgainst,
		sum(s.Shutouts) as Shutouts,
		sum(s.Wins) as Wins,
		NULL as BCS
	from
		GoalieStatSeasons s
	where
		s.PlayerId > 0
	group by
		s.PlayerId


	update #goalieStatCareersNew
	set
		BCS = BINARY_CHECKSUM(PlayerId,
								Seasons,
								Games,
								GoalsAgainst,
								Shutouts,
								Wins)

	INSERT INTO #goalieStatCareersCopy
	SELECT 
		PlayerId,
		Seasons,
		Games,
		GoalsAgainst,
		Shutouts,
		Wins,
		BINARY_CHECKSUM(PlayerId,
								Seasons,
								Games,
								GoalsAgainst,
								Shutouts,
								Wins) as BCS
	FROM 
		GoalieStatCareers


	IF (@dryrun = 1) 
	BEGIN
		-- this is not a dry run
		PRINT 'DRY RUN. NOT UPDATING REAL TABLES'

		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		-- TODO FIGURE OUT HOW TO DO CORRECTLY

		update #goalieStatCareersCopy
		set
			Seasons = n.Seasons,
			Games = n.Games,
			GoalsAgainst = n.GoalsAgainst,
			Shutouts = n.Shutouts,
			Wins = n.Wins
		from
			#goalieStatCareersCopy c INNER JOIN
			#goalieStatCareersNew n ON (c.PlayerId = n.PlayerId)
		where
			c.BCS <> n.BCS

		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into #goalieStatCareersCopy
		select
			n.*
		from
			#goalieStatCareersNew n left join
			#goalieStatCareersCopy c on (c.PlayerId = n.PlayerId)
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

		update GoalieStatCareers
		set
			Seasons = n.Seasons,
			Games = n.Games,
			GoalsAgainst = n.GoalsAgainst,
			Shutouts = n.Shutouts,
			Wins = n.Wins
		from
			GoalieStatCareers r INNER JOIN
			#goalieStatCareersCopy c ON (r.PlayerId = c.PlayerId) INNER JOIN
			#goalieStatCareersNew n ON (c.PlayerId = n.PlayerId)
		where
			c.BCS <> n.BCS

		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into GoalieStatCareers (PlayerId,
			Seasons,
			Games,
			GoalsAgainst,
			Shutouts,
			Wins)
		select
			n.PlayerId,
			n.Seasons,
			n.Games,
			n.GoalsAgainst,
			n.Shutouts,
			n.Wins
		from
			#goalieStatCareersNew n left join
			GoalieStatCareers c on (c.PlayerId = n.PlayerId)
		where
			c.PlayerId is null

		update #results set NewRecordsInserted = @@ROWCOUNT

	END

	update #results set ProcessedRecordsMatchExistingRecords = (select count(*) from #goalieStatCareersNew) - NewRecordsInserted - ExistingRecordsUpdated

	select * from #results
END TRY
BEGIN CATCH
    THROW;
END CATCH;


GO


