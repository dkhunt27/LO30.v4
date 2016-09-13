
--DROP PROCEDURE [dbo].[DeriveForWebTeamStandings]

CREATE PROCEDURE dbo.DeriveForWebTeamStandings
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

	SET @StartingSeasonId = 56;
	SET @EndingSeasonId = 56;

	SET @DryRun = 0;
-- STOP comment this out when saving as stored proc
*/

	IF OBJECT_ID('tempdb..#results') IS NOT NULL DROP TABLE #results
	IF OBJECT_ID('tempdb..#forWebTeamStandingsCopy') IS NOT NULL DROP TABLE #forWebTeamStandingsCopy
	IF OBJECT_ID('tempdb..#forWebTeamStandingsNew') IS NOT NULL DROP TABLE #forWebTeamStandingsNew

	CREATE TABLE #results (
		TableName nvarchar(35) NOT NULL,
		NewRecordsInserted int NOT NULL,
		ExistingRecordsUpdated int NOT NULL,
		ExistingRecordsDeleted int NOT NULL,
		ProcessedRecordsMatchExistingRecords int NOT NULL
	)

	CREATE TABLE #forWebTeamStandingsNew (
		SID int NOT NULL,
		TID int NOT NULL,
		PFS bit NOT NULL,
		Div nvarchar(35) NOT NULL,
		Ranking int NOT NULL,
		Team nvarchar(35) NOT NULL,
		GP int NOT NULL,
		W int NOT NULL,
		L int NOT NULL,
		T int NOT NULL,
		PTS int NOT NULL,
		GF int NOT NULL,
		GA int NOT NULL,
		PIM int NOT NULL,
		S int NOT NULL,
		BCS int NULL
	)
	CREATE UNIQUE INDEX PK ON #forWebTeamStandingsNew(SID, TID, PFS)

	CREATE TABLE #forWebTeamStandingsCopy (
		SID int NOT NULL,
		TID int NOT NULL,
		PFS bit NOT NULL,
		Div nvarchar(35) NOT NULL,
		Ranking int NOT NULL,
		Team nvarchar(35) NOT NULL,
		GP int NOT NULL,
		W int NOT NULL,
		L int NOT NULL,
		T int NOT NULL,
		PTS int NOT NULL,
		GF int NOT NULL,
		GA int NOT NULL,
		PIM int NOT NULL,
		S int NOT NULL,
		BCS int NULL
	)
	CREATE UNIQUE INDEX PK ON #forWebTeamStandingsCopy(SID, TID, PFS)

	INSERT INTO #results
	SELECT
		'ForWebTeamStandings' as TableName,
		0 as NewRecordsInserted,
		0 as ExistingRecordsUpdated,
		0 as ExistingRecordsDeleted,
		0 as ProcessedRecordsMatchExistingRecords


	insert into #forWebTeamStandingsNew
	select
		s.SeasonId,
		s.TeamId,
		s.Playoffs,
		d.DivisionLongName,
		s.Ranking,
		t.TeamNameLong,
		s.Games,
		s.Wins,
		s.Losses,
		s.Ties,
		s.Points,
		s.GoalsFor,
		s.GoalsAgainst,
		s.PenaltyMinutes,
		s.Subs,
		NULL as BCS
	from
		TeamStandings s INNER JOIN
		Teams t on (s.TeamId = t.TeamId) INNER JOIN
		Divisions d on (s.DivisionId = d.DivisionId)
	where
		s.SeasonId between @StartingSeasonId and @EndingSeasonId


	update #forWebTeamStandingsNew
	set
		BCS = BINARY_CHECKSUM(SID,
								TID,
								PFS,
								Div,
								Ranking,
								Team,
								GP,
								W,
								L,
								T,
								PTS,
								GF,
								GA,
								PIM,
								S)

	INSERT INTO #forWebTeamStandingsCopy
	SELECT 
		SID,
		TID,
		PFS,
		Div,
		Ranking,
		Team,
		GP,
		W,
		L,
		T,
		PTS,
		GF,
		GA,
		PIM,
		S,
		BINARY_CHECKSUM(SID,
								TID,
								PFS,
								Div,
								Ranking,
								Team,
								GP,
								W,
								L,
								T,
								PTS,
								GF,
								GA,
								PIM,
								S) as BCS
	FROM 
		ForWebTeamStandings 

    /* audit
			select * from #forWebTeamStandingsNew where TID = 308
			select * from #forWebTeamStandingsCopy where TID = 308
    */

	IF (@dryrun = 1) 
	BEGIN
		-- this is not a dry run
		PRINT 'DRY RUN. NOT UPDATING REAL TABLES'

		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		-- TODO FIGURE OUT HOW TO DO CORRECTLY

		update #forWebTeamStandingsCopy
		set
			Div = n.Div,
			Ranking = n.Ranking,
			Team = n.Team,
			GP = n.GP,
			W = n.W,
			L = n.L,
			T = n.T,
			PTS = n.PTS,
			GF = n.GF,
			GA = n.GA,
			PIM = n.PIM,
			S = n.S --,
			--WPCT = case when n.GP = 0 then 0 else n.W/n.GP end
		from
			#forWebTeamStandingsCopy c INNER JOIN
			#forWebTeamStandingsNew n ON (c.SID = n.SID AND c.TID = n.TID AND c.PFS = n.PFS)
		where
			c.BCS <> n.BCS

		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into #forWebTeamStandingsCopy
		select
			n.*
		from
			#forWebTeamStandingsNew n left join
			#forWebTeamStandingsCopy c on (c.SID = n.SID AND c.TID = n.TID AND c.PFS = n.PFS)
		where
			c.TID is null

		update #results set NewRecordsInserted = @@ROWCOUNT
	END
	ELSE
	BEGIN
		-- this is not a dry run
		PRINT 'NOT A DRY RUN. UPDATING REAL TABLES'

		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		-- TODO FIGURE OUT HOW TO DO CORRECTLY

		update ForWebTeamStandings
		set
			Div = n.Div,
			Ranking = n.Ranking,
			Team = n.Team,
			GP = n.GP,
			W = n.W,
			L = n.L,
			T = n.T,
			PTS = n.PTS,
			GF = n.GF,
			GA = n.GA,
			PIM = n.PIM,
			S = n.S,
			WPCT = case when n.GP = 0 then 0 else convert(real,n.W)/convert(real, n.GP) end
		from
			ForWebTeamStandings r INNER JOIN
			#forWebTeamStandingsCopy c ON (r.SID = c.SID AND r.TID = c.TID AND r.PFS = c.PFS) INNER JOIN
			#forWebTeamStandingsNew n ON (c.SID = n.SID AND c.TID = n.TID AND c.PFS = n.PFS)
		where
			c.BCS <> n.BCS

		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into ForWebTeamStandings
		select
			n.SID,
			n.TID,
			n.PFS,
			n.Div,
			n.Ranking,
			n.Team,
			n.GP,
			n.W,
			n.L,
			n.T,
			n.PTS,
			n.GF,
			n.GA,
			n.PIM,
			n.S,
			case when n.GP = 0 then 0 else convert(real,n.W)/convert(real, n.GP) end as WPCT
		from
			#forWebTeamStandingsNew n left join
			ForWebTeamStandings c on (c.SID = n.SID AND c.TID = n.TID AND c.PFS = n.PFS)
		where
			c.TID is null

		update #results set NewRecordsInserted = @@ROWCOUNT


	END

	update #results set ProcessedRecordsMatchExistingRecords = (select count(*) from #forWebTeamStandingsNew) - NewRecordsInserted - ExistingRecordsUpdated

	select * from #results
END TRY
BEGIN CATCH
    THROW;
END CATCH;



