
--DROP PROCEDURE [dbo].[DeriveForWebGoalieStats]

CREATE PROCEDURE dbo.DeriveForWebGoalieStats
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
	IF OBJECT_ID('tempdb..#forWebGoalieStatsCopy') IS NOT NULL DROP TABLE #forWebGoalieStatsCopy
	IF OBJECT_ID('tempdb..#forWebGoalieStatsNew') IS NOT NULL DROP TABLE #forWebGoalieStatsNew

	CREATE TABLE #results (
		TableName nvarchar(35) NOT NULL,
		NewRecordsInserted int NOT NULL,
		ExistingRecordsUpdated int NOT NULL,
		ExistingRecordsDeleted int NOT NULL,
		ProcessedRecordsMatchExistingRecords int NOT NULL
	)

	CREATE TABLE #forWebGoalieStatsNew (
		SID int NOT NULL,
		TID int NOT NULL,
		PID int NOT NULL,
		PFS bit NOT NULL,
		Sub nvarchar(1) NOT NULL,
		Player nvarchar(50) NOT NULL,
		Team nvarchar(35) NOT NULL,
		GP int NOT NULL,
		GA int NOT NULL,
		GAA float NOT NULL,
		SO int NOT NULL,
		W int NOT NULL,
		BCS int NULL
	)
	CREATE UNIQUE INDEX PK ON #forWebGoalieStatsNew(SID, TID, PID, PFS, Sub)

	CREATE TABLE #forWebGoalieStatsCopy (
		SID int NOT NULL,
		TID int NOT NULL,
		PID int NOT NULL,
		PFS bit NOT NULL,
		Sub nvarchar(1) NOT NULL,
		Player nvarchar(50) NOT NULL,
		Team nvarchar(35) NOT NULL,
		GP int NOT NULL,
		GA int NOT NULL,
		GAA float NOT NULL,
		SO int NOT NULL,
		W int NOT NULL,
		BCS int NULL
	)
	CREATE UNIQUE INDEX PK ON #forWebGoalieStatsCopy(SID, TID, PID, PFS, Sub)

	INSERT INTO #results
	SELECT
		'ForWebGoalieStats' as TableName,
		0 as NewRecordsInserted,
		0 as ExistingRecordsUpdated,
		0 as ExistingRecordsDeleted,
		0 as ProcessedRecordsMatchExistingRecords


	insert into #forWebGoalieStatsNew
	select
		s.SeasonId,
		s.TeamId,
		s.PlayerId,
		s.Playoffs,
		case when s.Sub = 1 then 'Y' else 'N' end,
		case when p.Suffix is null then p.FirstName + ' ' + p.LastName else p.FirstName + ' ' + p.LastName + ' ' + p.Suffix end,
		t.TeamNameLong,
		s.Games,
		s.GoalsAgainst,
		case when s.Games = 0 then 0 else convert(float, s.GoalsAgainst) / convert(float,s.Games) end,
		s.Shutouts,
		s.Wins,
		NULL as BCS
	from
		GoalieStatTeams s INNER JOIN
		Players p on (s.PlayerId = p.PlayerId) INNER JOIN
		Teams t on (s.TeamId = t.TeamId)
	where
		s.SeasonId between @StartingSeasonId and @EndingSeasonId AND
		s.PlayerId <> 0


	update #forWebGoalieStatsNew
	set
		BCS = BINARY_CHECKSUM(SID,
								TID,
								PID,
								PFS,
								Sub,
								Player,
								Team,
								GP,
								GA,
								GAA,
								SO,
								W)

	INSERT INTO #forWebGoalieStatsCopy
	SELECT 
		SID,
		TID,
		PID,
		PFS,
		Sub,
		Player,
		Team,
		GP,
		GA,
		GAA,
		SO,
		W,
		BINARY_CHECKSUM(SID,
								TID,
								PID,
								PFS,
								Sub,
								Player,
								Team,
								GP,
								GA,
								GAA,
								SO,
								W) as BCS
	FROM 
		ForWebGoalieStats


	IF (@dryrun = 1) 
	BEGIN
		-- this is not a dry run
		PRINT 'DRY RUN. NOT UPDATING REAL TABLES'

		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		delete from #forWebGoalieStatsCopy
		from
			#forWebGoalieStatsCopy c left join
			#forWebGoalieStatsNew n on (c.SID = n.SID AND c.TID = n.TID AND c.PID = n.PID AND c.PFS = n.PFS AND c.Sub = n.Sub)
		where
			n.SID is null and
			c.SID between @StartingSeasonId and @EndingSeasonId

		update #results set ExistingRecordsDeleted = @@ROWCOUNT

		update #forWebGoalieStatsCopy
		set
			Player = n.Player,
			Team = n.Team,
			GP = n.GP,
			GA = n.GA,
			GAA = n.GAA,
			SO = n.SO,
			W = n.W
		from
			#forWebGoalieStatsCopy c INNER JOIN
			#forWebGoalieStatsNew n ON (c.SID = n.SID AND c.TID = n.TID AND c.PID = n.PID AND c.PFS = n.PFS AND c.Sub = n.Sub)
		where
			c.BCS <> n.BCS

		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into #forWebGoalieStatsCopy
		select
			n.*
		from
			#forWebGoalieStatsNew n left join
			#forWebGoalieStatsCopy c on (c.SID = n.SID AND c.TID = n.TID AND c.PID = n.PID AND c.PFS = n.PFS AND c.Sub = n.Sub)
		where
			c.PID is null

		update #results set NewRecordsInserted = @@ROWCOUNT
	END
	ELSE
	BEGIN
		-- this is not a dry run
		PRINT 'NOT A DRY RUN. UPDATING REAL TABLES'

		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		delete from ForWebGoalieStats
		from
			ForWebGoalieStats c left join
			#forWebGoalieStatsNew n on (c.SID = n.SID AND c.TID = n.TID AND c.PID = n.PID AND c.PFS = n.PFS AND c.Sub = n.Sub)
		where
			n.SID is null and
			c.SID between @StartingSeasonId and @EndingSeasonId

		update #results set ExistingRecordsDeleted = @@ROWCOUNT

		update ForWebGoalieStats
		set
			Player = n.Player,
			Team = n.Team,
			GP = n.GP,
			GA = n.GA,
			GAA = n.GAA,
			SO = n.SO,
			W = n.W
		from
			ForWebGoalieStats r INNER JOIN
			#forWebGoalieStatsCopy c ON (r.SID = c.SID AND r.TID = c.TID AND r.PID = c.PID AND r.PFS = c.PFS AND r.Sub = c.Sub) INNER JOIN
			#forWebGoalieStatsNew n ON (c.SID = n.SID AND c.TID = n.TID AND c.PID = n.PID AND c.PFS = n.PFS AND c.Sub = n.Sub)
		where
			c.BCS <> n.BCS

		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into ForWebGoalieStats
		select
			n.SID,
			n.TID,
			n.PID,
			n.PFS,
			n.Sub,
			n.Player,
			n.Team,
			n.GP,
			n.GA,
			n.GAA,
			n.SO,
			n.W
		from
			#forWebGoalieStatsNew n left join
			ForWebGoalieStats c on (c.SID = n.SID AND c.TID = n.TID AND c.PID = n.PID AND c.PFS = n.PFS AND c.Sub = n.Sub)
		where
			c.PID is null

		update #results set NewRecordsInserted = @@ROWCOUNT

	END

	update #results set ProcessedRecordsMatchExistingRecords = (select count(*) from #forWebGoalieStatsNew) - NewRecordsInserted - ExistingRecordsUpdated

	select * from #results
END TRY
BEGIN CATCH
    THROW;
END CATCH;
