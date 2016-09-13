
--DROP PROCEDURE [dbo].[DerivePlayerStatsCareer]

CREATE PROCEDURE dbo.DerivePlayerStatsCareer
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
	IF OBJECT_ID('tempdb..#playerStatCareersCopy') IS NOT NULL DROP TABLE #playerStatCareersCopy
	IF OBJECT_ID('tempdb..#playerStatCareersNew') IS NOT NULL DROP TABLE #playerStatCareersNew

	CREATE TABLE #results (
		TableName nvarchar(35) NOT NULL,
		NewRecordsInserted int NOT NULL,
		ExistingRecordsUpdated int NOT NULL,
		ExistingRecordsDeleted int NOT NULL,
		ProcessedRecordsMatchExistingRecords int NOT NULL
	)

	CREATE TABLE #playerStatCareersNew (
		PlayerId int NOT NULL,
		Seasons int NOT NULL,
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
	CREATE UNIQUE INDEX PK ON #playerStatCareersNew(PlayerId)

	CREATE TABLE #playerStatCareersCopy (
		PlayerId int NOT NULL,
		Seasons int NOT NULL,
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
	CREATE UNIQUE INDEX PK ON #playerStatCareersCopy(PlayerId)

	INSERT INTO #results
	SELECT
		'PlayerStatCareers' as TableName,
		0 as NewRecordsInserted,
		0 as ExistingRecordsUpdated,
		0 as ExistingRecordsDeleted,
		0 as ProcessedRecordsMatchExistingRecords

	-- 'Count Player Stats Careers'
	insert into #playerStatCareersNew
	select
		s.PlayerId,
		count(distinct s.SeasonId) as Seasons,
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
		PlayerStatSeasons s
	where
		s.PlayerId > 0 
	group by
		s.PlayerId


	update #playerStatCareersNew
	set
		BCS = BINARY_CHECKSUM(PlayerId,
								Seasons,
								Games,
								Goals,
								Assists,
								Points,
								PenaltyMinutes,
								PowerPlayGoals,
								ShortHandedGoals,
								GameWinningGoals)


	-- 'Count Copying PlayerStatCareers'
	INSERT INTO #playerStatCareersCopy
	SELECT 
		PlayerId,
		Seasons,
		Games,
		Goals,
		Assists,
		Points,
		PenaltyMinutes,
		PowerPlayGoals,
		ShortHandedGoals,
		GameWinningGoals,
		BINARY_CHECKSUM(PlayerId,
								Seasons,
								Games,
								Goals,
								Assists,
								Points,
								PenaltyMinutes,
								PowerPlayGoals,
								ShortHandedGoals,
								GameWinningGoals) as BCS
	FROM 
		PlayerStatCareers


	IF (@dryrun = 1) 
	BEGIN
		-- this is not a dry run
		PRINT 'DRY RUN. NOT UPDATING REAL TABLES'

		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		-- TODO FIGURE OUT HOW TO DO CORRECTLY

		update #playerStatCareersCopy
		set
			Seasons = n.Seasons,
			Games = n.Games,
			Goals = n.Goals,
			Assists = n.Assists,
			Points = n.Points,
			PenaltyMinutes = n.PenaltyMinutes,
			PowerPlayGoals = n.PowerPlayGoals,
			ShortHandedGoals = n.ShortHandedGoals,
			GameWinningGoals = n.GameWinningGoals
		from
			#playerStatCareersCopy c INNER JOIN
			#playerStatCareersNew n ON (c.PlayerId = n.PlayerId)
		where
			c.BCS <> n.BCS

		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into #playerStatCareersCopy
		select
			n.*
		from
			#playerStatCareersNew n left join
			#playerStatCareersCopy c on (c.PlayerId = n.PlayerId)
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

		update PlayerStatCareers
		set
			Seasons = n.Seasons,
			Games = n.Games,
			Goals = n.Goals,
			Assists = n.Assists,
			Points = n.Points,
			PenaltyMinutes = n.PenaltyMinutes,
			PowerPlayGoals = n.PowerPlayGoals,
			ShortHandedGoals = n.ShortHandedGoals,
			GameWinningGoals = n.GameWinningGoals
		from
			PlayerStatCareers r INNER JOIN
			#playerStatCareersCopy c ON (r.PlayerId = c.PlayerId) INNER JOIN
			#playerStatCareersNew n ON (c.PlayerId = n.PlayerId)
		where
			c.BCS <> n.BCS

		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into PlayerStatCareers(PlayerId,
			Seasons,
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
			n.Seasons,
			n.Games,
			n.Goals,
			n.Assists,
			n.Points,
			n.PenaltyMinutes,
			n.PowerPlayGoals,
			n.ShortHandedGoals,
			n.GameWinningGoals
		from
			#playerStatCareersNew n left join
			PlayerStatCareers c on (c.PlayerId = n.PlayerId)
		where
			c.PlayerId is null

		update #results set NewRecordsInserted = @@ROWCOUNT

	END

	update #results set ProcessedRecordsMatchExistingRecords = (select count(*) from #playerStatCareersNew) - NewRecordsInserted - ExistingRecordsUpdated

	select * from #results
END TRY
BEGIN CATCH
    THROW;
END CATCH;
