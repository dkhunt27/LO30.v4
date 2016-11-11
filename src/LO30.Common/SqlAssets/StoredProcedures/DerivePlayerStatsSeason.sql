
--DROP PROCEDURE [dbo].[DerivePlayerStatsSeason]

CREATE PROCEDURE dbo.DerivePlayerStatsSeason
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
	IF OBJECT_ID('tempdb..#playerStatSeasonsCopy') IS NOT NULL DROP TABLE #playerStatSeasonsCopy
	IF OBJECT_ID('tempdb..#playerStatSeasonsNew') IS NOT NULL DROP TABLE #playerStatSeasonsNew

	CREATE TABLE #results (
		TableName nvarchar(35) NOT NULL,
		NewRecordsInserted int NOT NULL,
		ExistingRecordsUpdated int NOT NULL,
		ExistingRecordsDeleted int NOT NULL,
		ProcessedRecordsMatchExistingRecords int NOT NULL
	)

	CREATE TABLE #playerStatSeasonsNew (
		PlayerId int NOT NULL,
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
		BCS int NULL
	)
	CREATE UNIQUE INDEX PK ON #playerStatSeasonsNew(PlayerId, SeasonId, Playoffs)

	CREATE TABLE #playerStatSeasonsCopy (
		PlayerId int NOT NULL,
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
		BCS int NULL
	)
	CREATE UNIQUE INDEX PK ON #playerStatSeasonsCopy(PlayerId, SeasonId, Playoffs)

	INSERT INTO #results
	SELECT
		'PlayerStatSeasons' as TableName,
		0 as NewRecordsInserted,
		0 as ExistingRecordsUpdated,
		0 as ExistingRecordsDeleted,
		0 as ProcessedRecordsMatchExistingRecords

	insert into #playerStatSeasonsNew
	select
		s.PlayerId,
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
		NULL as BCS
	from
		PlayerStatTeams s
	where
		s.SeasonId between @StartingSeasonId and @EndingSeasonId AND
		s.PlayerId > 0
	group by
		s.PlayerId,
		s.SeasonId,
		s.Playoffs


	update #playerStatSeasonsNew
	set
		BCS = BINARY_CHECKSUM(PlayerId,
								SeasonId,
								Playoffs,
								Games,
								Goals,
								Assists,
								Points,
								PenaltyMinutes,
								PowerPlayGoals,
								ShortHandedGoals,
								GameWinningGoals)


	INSERT INTO #playerStatSeasonsCopy
	SELECT 
		PlayerId,
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
		BINARY_CHECKSUM(PlayerId,
								SeasonId,
								Playoffs,
								Games,
								Goals,
								Assists,
								Points,
								PenaltyMinutes,
								PowerPlayGoals,
								ShortHandedGoals,
								GameWinningGoals) as BCS
	FROM 
		PlayerStatSeasons


	IF (@dryrun = 1) 
	BEGIN
		-- this is not a dry run
		PRINT 'DRY RUN. NOT UPDATING REAL TABLES'

		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		delete from #playerStatSeasonsCopy
		from
			#playerStatSeasonsCopy c left join
			#playerStatSeasonsNew n on (c.PlayerId = n.PlayerId AND c.SeasonId = n.SeasonId AND c.Playoffs = n.Playoffs)
		where
			n.PlayerId is null AND
			c.SeasonId between @StartingSeasonId and @EndingSeasonId
		
		update #results set ExistingRecordsDeleted = @@ROWCOUNT

		update #playerStatSeasonsCopy
		set
			Games = n.Games,
			Goals = n.Goals,
			Assists = n.Assists,
			Points = n.Points,
			PenaltyMinutes = n.PenaltyMinutes,
			PowerPlayGoals = n.PowerPlayGoals,
			ShortHandedGoals = n.ShortHandedGoals,
			GameWinningGoals = n.GameWinningGoals
		from
			#playerStatSeasonsCopy c INNER JOIN
			#playerStatSeasonsNew n ON (c.PlayerId = n.PlayerId AND c.SeasonId = n.SeasonId AND c.Playoffs = n.Playoffs)
		where
			c.BCS <> n.BCS

		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into #playerStatSeasonsCopy
		select
			n.*
		from
			#playerStatSeasonsNew n left join
			#playerStatSeasonsCopy c on (c.PlayerId = n.PlayerId AND c.SeasonId = n.SeasonId AND c.Playoffs = n.Playoffs)
		where
			c.PlayerId is null

		update #results set NewRecordsInserted = @@ROWCOUNT
	END
	ELSE
	BEGIN
		-- this is not a dry run
		PRINT 'NOT A DRY RUN. UPDATING REAL TABLES'

		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		delete from PlayerStatSeasons
		from
			PlayerStatSeasons c left join
			#playerStatSeasonsNew n on (c.PlayerId = n.PlayerId AND c.SeasonId = n.SeasonId AND c.Playoffs = n.Playoffs)
		where
			n.PlayerId is null AND
			c.SeasonId between @StartingSeasonId and @EndingSeasonId

		update #results set ExistingRecordsDeleted = @@ROWCOUNT

		update PlayerStatSeasons
		set
			Games = n.Games,
			Goals = n.Goals,
			Assists = n.Assists,
			Points = n.Points,
			PenaltyMinutes = n.PenaltyMinutes,
			PowerPlayGoals = n.PowerPlayGoals,
			ShortHandedGoals = n.ShortHandedGoals,
			GameWinningGoals = n.GameWinningGoals
		from
			PlayerStatSeasons r INNER JOIN
			#playerStatSeasonsCopy c ON (r.PlayerId = c.PlayerId AND r.SeasonId = c.SeasonId AND r.Playoffs = c.Playoffs) INNER JOIN
			#playerStatSeasonsNew n ON (c.PlayerId = n.PlayerId AND c.SeasonId = n.SeasonId AND c.Playoffs = n.Playoffs)
		where
			c.BCS <> n.BCS

		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into PlayerStatSeasons(PlayerId,
			SeasonId,
			Playoffs,
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
			n.SeasonId,
			n.Playoffs,
			n.Games,
			n.Goals,
			n.Assists,
			n.Points,
			n.PenaltyMinutes,
			n.PowerPlayGoals,
			n.ShortHandedGoals,
			n.GameWinningGoals
		from
			#playerStatSeasonsNew n left join
			PlayerStatSeasons c on (c.PlayerId = n.PlayerId AND c.SeasonId = n.SeasonId AND c.Playoffs = n.Playoffs)
		where
			c.PlayerId is null

		update #results set NewRecordsInserted = @@ROWCOUNT

	END

	update #results set ProcessedRecordsMatchExistingRecords = (select count(*) from #playerStatSeasonsNew) - NewRecordsInserted - ExistingRecordsUpdated

	select * from #results
END TRY
BEGIN CATCH
    THROW;
END CATCH;

