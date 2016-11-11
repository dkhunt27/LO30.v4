
--DROP PROCEDURE [dbo].[DeriveLineStatsSeason]

CREATE PROCEDURE [dbo].[DeriveLineStatsSeason]
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
	IF OBJECT_ID('tempdb..#lineStatSeasonsCopy') IS NOT NULL DROP TABLE #lineStatSeasonsCopy
	IF OBJECT_ID('tempdb..#lineStatSeasonsNew') IS NOT NULL DROP TABLE #lineStatSeasonsNew

	CREATE TABLE #results (
		TableName nvarchar(35) NOT NULL,
		NewRecordsInserted int NOT NULL,
		ExistingRecordsUpdated int NOT NULL,
		ExistingRecordsDeleted int NOT NULL,
		ProcessedRecordsMatchExistingRecords int NOT NULL
	)

	CREATE TABLE #lineStatSeasonsNew (
		TeamId int NOT NULL,
		Line int NOT NULL,
		SeasonId int NOT NULL,
		Playoffs bit NOT NULL,
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
	CREATE UNIQUE INDEX PK ON #lineStatSeasonsNew(TeamId, Line, SeasonId, Playoffs)

	CREATE TABLE #lineStatSeasonsCopy (
		TeamId int NOT NULL,
		Line int NOT NULL,
		SeasonId int NOT NULL,
		Playoffs bit NOT NULL,
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
	CREATE UNIQUE INDEX PK ON #lineStatSeasonsCopy(TeamId, Line, SeasonId, Playoffs)

	INSERT INTO #results
	SELECT
		'LineStatSeasons' as TableName,
		0 as NewRecordsInserted,
		0 as ExistingRecordsUpdated,
		0 as ExistingRecordsDeleted,
		0 as ProcessedRecordsMatchExistingRecords

	insert into #lineStatSeasonsNew
	select
		s.TeamId,
		s.Line,
		s.SeasonId,
		s.Playoffs,
		sum(s.Games) as Games,
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
		LineStatTeams s
	where
		s.SeasonId between @StartingSeasonId and @EndingSeasonId 
	group by
		s.TeamId,
		s.Line,
		s.SeasonId,
		s.Playoffs


	update #lineStatSeasonsNew
	set
		BCS = BINARY_CHECKSUM(TeamId,
								Line,
								SeasonId,
								Playoffs,
								Games,
								Goals,
								Assists,
								Points,
								PenaltyMinutes,
								PowerPlayGoals,
								ShortHandedGoals,
								GameWinningGoals,
								GoalsAgainst)


	INSERT INTO #lineStatSeasonsCopy
	SELECT 
		TeamId,
		Line,
		SeasonId,
		Playoffs,
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
								SeasonId,
								Playoffs,
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
		LineStatSeasons


	IF (@dryrun = 1) 
	BEGIN
		-- this is not a dry run
		PRINT 'DRY RUN. NOT UPDATING REAL TABLES'

		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		delete from #lineStatSeasonsCopy
		from
			#lineStatSeasonsCopy c left join
			#lineStatSeasonsNew n on (c.TeamId = n.TeamId AND c.Line = n.Line AND c.SeasonId = n.SeasonId AND c.Playoffs = n.Playoffs)
		where
			n.TeamId is null AND
			c.SeasonId between @StartingSeasonId and @EndingSeasonId
		
		update #results set ExistingRecordsDeleted = @@ROWCOUNT

		update #lineStatSeasonsCopy
		set
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
			#lineStatSeasonsCopy c INNER JOIN
			#lineStatSeasonsNew n ON (c.TeamId = n.TeamId AND c.Line = n.Line AND c.SeasonId = n.SeasonId AND c.Playoffs = n.Playoffs)
		where
			c.BCS <> n.BCS

		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into #lineStatSeasonsCopy
		select
			n.*
		from
			#lineStatSeasonsNew n left join
			#lineStatSeasonsCopy c on (c.TeamId = n.TeamId AND c.Line = n.Line AND c.SeasonId = n.SeasonId AND c.Playoffs = n.Playoffs)
		where
			c.TeamId is null

		update #results set NewRecordsInserted = @@ROWCOUNT
	END
	ELSE
	BEGIN
		-- this is not a dry run
		PRINT 'NOT A DRY RUN. UPDATING REAL TABLES'

		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		delete from LineStatSeasons
		from
			LineStatSeasons c left join
			#lineStatSeasonsNew n on (c.TeamId = n.TeamId AND c.Line = n.Line AND c.SeasonId = n.SeasonId AND c.Playoffs = n.Playoffs)
		where
			n.TeamId is null AND
			c.SeasonId between @StartingSeasonId and @EndingSeasonId

		update #results set ExistingRecordsDeleted = @@ROWCOUNT

		update LineStatSeasons
		set
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
			LineStatSeasons r INNER JOIN
			#lineStatSeasonsCopy c ON (r.TeamId = c.TeamId AND r.Line = c.Line AND r.SeasonId = c.SeasonId AND r.Playoffs = c.Playoffs) INNER JOIN
			#lineStatSeasonsNew n ON (c.TeamId = n.TeamId AND c.Line = n.Line AND c.SeasonId = n.SeasonId AND c.Playoffs = n.Playoffs)
		where
			c.BCS <> n.BCS

		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into LineStatSeasons(TeamId,
			Line,
			SeasonId,
			Playoffs,
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
			n.SeasonId,
			n.Playoffs,
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
			#lineStatSeasonsNew n left join
			LineStatSeasons c on (c.TeamId = n.TeamId AND c.Line = n.Line AND c.SeasonId = n.SeasonId AND c.Playoffs = n.Playoffs)
		where
			c.TeamId is null

		update #results set NewRecordsInserted = @@ROWCOUNT

	END

	update #results set ProcessedRecordsMatchExistingRecords = (select count(*) from #lineStatSeasonsNew) - NewRecordsInserted - ExistingRecordsUpdated

	select * from #results
END TRY
BEGIN CATCH
    THROW;
END CATCH;
