
--DROP PROCEDURE [dbo].[DeriveTeamStandings]

CREATE PROCEDURE dbo.DeriveTeamStandings
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
	IF OBJECT_ID('tempdb..#teamStandingsDetail') IS NOT NULL DROP TABLE #teamStandingsDetail
	IF OBJECT_ID('tempdb..#teamStandingsCopy') IS NOT NULL DROP TABLE #teamStandingsCopy
	IF OBJECT_ID('tempdb..#teamStandingsNew') IS NOT NULL DROP TABLE #teamStandingsNew
	IF OBJECT_ID('tempdb..#teamStandingsRank') IS NOT NULL DROP TABLE #teamStandingsRank

	CREATE TABLE #results (
		TableName nvarchar(35) NOT NULL,
		NewRecordsInserted int NOT NULL,
		ExistingRecordsUpdated int NOT NULL,
		ExistingRecordsDeleted int NOT NULL,
		ProcessedRecordsMatchExistingRecords int NOT NULL
	)

	CREATE TABLE #teamStandingsDetail (
		GameId int NOT NULL,
		TeamId int NOT NULL,
		Playoffs bit NOT NULL,
		SeasonId int NOT NULL,
		DivisionId int NOT NULL,
		Games int NOT NULL,
		Wins int NOT NULL,
		Losses int NOT NULL,
		Ties int NOT NULL,
		GoalsFor int NOT NULL,
		GoalsAgainst int NOT NULL,
		PenaltyMinutes int NOT NULL,
		Subs int NOT NULL
	)
	CREATE UNIQUE INDEX PK ON #teamStandingsDetail(GameId, TeamId)

	CREATE TABLE #teamStandingsRank (
		TeamId int NOT NULL,
		Playoffs bit NOT NULL,
		SeasonId int NOT NULL,
		DivisionId int NOT NULL,
		Points int NOT NULL,
		Wins int NOT NULL,
		Diff int NOT NULL,
		PenaltyMinutes int NOT NULL,
		Ranking int NOT NULL
	)
	CREATE UNIQUE INDEX PK ON #teamStandingsRank(TeamId, Playoffs)

	CREATE TABLE #teamStandingsNew (
		TeamId int NOT NULL,
		Playoffs bit NOT NULL,
		SeasonId int NOT NULL,
		DivisionId int NOT NULL,
		Ranking int NOT NULL,
		Games int NOT NULL,
		Wins int NOT NULL,
		Losses int NOT NULL,
		Ties int NOT NULL,
		Points int NOT NULL,
		GoalsFor int NOT NULL,
		GoalsAgainst int NOT NULL,
		PenaltyMinutes int NOT NULL,
		Subs int NOT NULL,
		BCS int NULL
	)
	CREATE UNIQUE INDEX PK ON #teamStandingsNew(TeamId, Playoffs)

	CREATE TABLE #teamStandingsCopy (
		TeamId int NOT NULL,
		Playoffs bit NOT NULL,
		SeasonId int NOT NULL,
		DivisionId int NOT NULL,
		Ranking int NOT NULL,
		Games int NOT NULL,
		Wins int NOT NULL,
		Losses int NOT NULL,
		Ties int NOT NULL,
		Points int NOT NULL,
		GoalsFor int NOT NULL,
		GoalsAgainst int NOT NULL,
		PenaltyMinutes int NOT NULL,
		Subs int NOT NULL,
		BCS int NULL
	)
	CREATE UNIQUE INDEX PK ON #teamStandingsCopy(TeamId, Playoffs)

	INSERT INTO #results
	SELECT
		'TeamStandings' as TableName,
		0 as NewRecordsInserted,
		0 as ExistingRecordsUpdated,
		0 as ExistingRecordsDeleted,
		0 as ProcessedRecordsMatchExistingRecords

	-- 'Count Team Standings Detail (games to process x 2)'
	insert into #teamStandingsDetail
	select
		gt.GameId,
		gt.TeamId,
		g.Playoffs,
		gt.SeasonId,
		t.DivisionId,
		case when goc.Outcome is null then 0 else 1 end as Games,
		case when goc.Outcome = 'W' then 1 else 0 end as Wins,
		case when goc.Outcome = 'L' then 1 else 0 end as Losses,
		case when goc.Outcome = 'T' then 1 else 0 end as Ties,
		case when goc.Outcome is null then 0 else goc.GoalsFor end as GoalsFor,
		case when goc.Outcome is null then 0 else goc.GoalsAgainst end as GoalsAgainst,
		case when goc.Outcome is null then 0 else goc.PenaltyMinutes end as PenaltyMinutes,
		case when goc.Outcome is null then 0 else goc.Subs end as Subs
	from
		GameTeams gt inner join
		GameOutcomes goc on (gt.GameId = goc.GameId AND gt.TeamId = goc.TeamId) inner join
		Games g on (gt.GameId = g.GameId) inner join
		Teams t on (gt.TeamId = t.TeamId)
	where
		gt.GameId between @StartingGameId and @EndingGameId

	-- 'Count TeamStandings (count of teams 8 or 16 if with playoffs)'
	insert into #teamStandingsNew
	select
		tsd.TeamId,
		tsd.Playoffs,
		tsd.SeasonId,
		tsd.DivisionId,
		0 as Ranking,
		sum(tsd.Games) as Games,
		sum(tsd.Wins) as Wins,
		sum(tsd.Losses) as Losses,
		sum(tsd.Ties) as Ties,
		0 as Points,
		sum(tsd.GoalsFor) as GoalsFor,
		sum(tsd.GoalsAgainst) as GoalsAgainst,
		sum(tsd.PenaltyMinutes) as PenaltyMinutes,
		sum(tsd.Subs) as Subs,
		null as BCS
	from
		#teamStandingsDetail tsd
	group by
		tsd.TeamId,
		tsd.Playoffs,
		tsd.SeasonId,
		tsd.DivisionId
	order by
		tsd.TeamId,
		tsd.Playoffs,
		tsd.SeasonId,
		tsd.DivisionId

	-- 'Count Set Points (count of teams 8 or 16 if with playoffs)'
	UPDATE #teamStandingsNew
	SET
		Points = (Wins * 2) + Ties

	-- 'Count Set DivisionId of Regular Season (count of teams 8)'
	UPDATE #teamStandingsNew
	SET
		DivisionId = 1
	WHERE
		Playoffs = 0

	-- 'Count Determine Ranking (count of teams 8 or 16 if with playoffs)'
	INSERT INTO #teamStandingsRank
	SELECT
		n.TeamId,
		n.Playoffs,
		n.SeasonId,
		n.DivisionId,
		n.Points,
		n.Wins,
		n.GoalsFor-n.GoalsAgainst as Diff,
		n.PenaltyMinutes,
		Rank() OVER (PARTITION BY n.DivisionId Order by n.Points desc, n.Wins desc, n.GoalsFor-n.GoalsAgainst desc, n.GoalsFor desc, n.PenaltyMinutes) as Ranking
	FROM
		#teamStandingsNew n

	-- 'Count Set Rank (count of teams 8 or 16 if with playoffs)'
	UPDATE #teamStandingsNew
	SET
		Ranking = r.Ranking
	FROM
		#teamStandingsNew n inner join
		#teamStandingsRank r on (n.TeamId = r.TeamId and n.Playoffs = r.Playoffs)


	update #teamStandingsNew
	set
		BCS = BINARY_CHECKSUM(TeamId,
								Playoffs,
								SeasonId,
								DivisionId,
								Ranking,
								Games,
								Wins,
								Losses,
								Ties,
								Points,
								GoalsFor,
								GoalsAgainst,
								PenaltyMinutes,
								Subs)

	-- 'Count Copying TeamStandings'
	INSERT INTO #teamStandingsCopy
	SELECT 
		TeamId,
		Playoffs,
		SeasonId,
		DivisionId,
		Ranking,
		Games,
		Wins,
		Losses,
		Ties,
		Points,
		GoalsFor,
		GoalsAgainst,
		PenaltyMinutes,
		Subs,
		BINARY_CHECKSUM(TeamId,
								Playoffs,
								SeasonId,
								DivisionId,
								Ranking,
								Games,
								Wins,
								Losses,
								Ties,
								Points,
								GoalsFor,
								GoalsAgainst,
								PenaltyMinutes,
								Subs) as BCS
	FROM 
		TeamStandings

	IF (@dryrun = 1) 
	BEGIN
		-- this is not a dry run
		PRINT 'DRY RUN. NOT UPDATING REAL TABLES'

		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		-- TODO FIGURE OUT HOW TO DO CORRECTLY

		update #teamStandingsCopy
		set
			SeasonId = n.SeasonId,
			DivisionId = n.DivisionId,
			Ranking = n.Ranking,
			Games = n.Games,
			Wins = n.Wins,
			Losses = n.Losses,
			Ties = n.Ties,
			Points = n.Points,
			GoalsFor = n.GoalsFor,
			GoalsAgainst = n.GoalsAgainst,
			PenaltyMinutes = n.PenaltyMinutes,
			Subs = n.Subs
		from
			#teamStandingsCopy c INNER JOIN
			#teamStandingsNew n ON (c.TeamId = n.TeamId AND c.Playoffs = n.Playoffs)
		where
			c.BCS <> n.BCS

		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into #teamStandingsCopy
		select
			n.*
		from
			#teamStandingsNew n left join
			#teamStandingsCopy c on (c.TeamId = n.TeamId AND c.Playoffs = n.Playoffs)
		where
			c.TeamId is null

		update #results set NewRecordsInserted = @@ROWCOUNT
	END
	ELSE
	BEGIN
		-- this is not a dry run
		PRINT 'NOT A DRY RUN. UPDATING REAL TABLES'

		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		-- TODO FIGURE OUT HOW TO DO CORRECTLY

		update TeamStandings
		set
			SeasonId = n.SeasonId,
			DivisionId = n.DivisionId,
			Ranking = n.Ranking,
			Games = n.Games,
			Wins = n.Wins,
			Losses = n.Losses,
			Ties = n.Ties,
			Points = n.Points,
			GoalsFor = n.GoalsFor,
			GoalsAgainst = n.GoalsAgainst,
			PenaltyMinutes = n.PenaltyMinutes,
			Subs = n.Subs
		from
			TeamStandings r INNER JOIN
			#teamStandingsCopy c ON (r.TeamId = c.TeamId AND r.Playoffs = c.Playoffs) INNER JOIN
			#teamStandingsNew n ON (c.TeamId = n.TeamId AND c.Playoffs = n.Playoffs)
		where
		    c.BCS <> n.BCS

		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into TeamStandings
		select
			n.TeamId,
			n.Playoffs,
			n.SeasonId,
			n.DivisionId,
			n.Ranking,
			n.Games,
			n.Wins,
			n.Losses,
			n.Ties,
			n.Points,
			n.GoalsFor,
			n.GoalsAgainst,
			n.PenaltyMinutes,
			n.Subs
		from
			#teamStandingsNew n left join
			TeamStandings c on (c.TeamId = n.TeamId AND c.Playoffs = n.Playoffs)
		where
			c.TeamId is null


		update #results set NewRecordsInserted = @@ROWCOUNT
	END

	update #results set ProcessedRecordsMatchExistingRecords = (select count(*) from #teamStandingsNew) - NewRecordsInserted - ExistingRecordsUpdated

	select * from #results

END TRY
BEGIN CATCH
    THROW;
END CATCH;
