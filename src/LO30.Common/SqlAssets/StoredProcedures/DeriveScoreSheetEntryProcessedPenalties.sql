
--DROP PROCEDURE [dbo].[DeriveScoreSheetEntryProcessedPenalties]

CREATE PROCEDURE dbo.DeriveScoreSheetEntryProcessedPenalties
	@StartingGameId int = 0, 
	@EndingGameId int = 0,
	@DryRun int = 0
AS
BEGIN TRY
	SET NOCOUNT ON

	DECLARE @TimePerPeriod int;
	SET @TimePerPeriod = 14;

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
	IF OBJECT_ID('tempdb..#audit') IS NOT NULL DROP TABLE #audit
	IF OBJECT_ID('tempdb..#scoreSheetEntryProcessedPenaltiesCopy') IS NOT NULL DROP TABLE #scoreSheetEntryProcessedPenaltiesCopy
	IF OBJECT_ID('tempdb..#scoreSheetEntryProcessedPenaltiesNew') IS NOT NULL DROP TABLE #scoreSheetEntryProcessedPenaltiesNew

	CREATE TABLE #results (
		TableName nvarchar(35) NOT NULL,
		NewRecordsInserted int NOT NULL,
		ExistingRecordsUpdated int NOT NULL,
		ExistingRecordsDeleted int NOT NULL,
		ProcessedRecordsMatchExistingRecords int NOT NULL
	)

	CREATE TABLE #scoreSheetEntryProcessedPenaltiesCopy (
		ScoreSheetEntryPenaltyId int NOT NULL,
		SeasonId int NOT NULL,
		TeamId int NOT NULL,
		GameId int NOT NULL,
		Period int NOT NULL,
		HomeTeam bit NOT NULL,
		PlayerId int NOT NULL,
		PenaltyId int NULL,
		TimeRemaining nvarchar(5) NOT NULL,
		TimeElapsed time(7) NULL,
		PenaltyMinutes int NOT NULL,
		BCS int NULL
	)
	CREATE UNIQUE INDEX PK ON #scoreSheetEntryProcessedPenaltiesCopy(ScoreSheetEntryPenaltyId)

	CREATE TABLE #scoreSheetEntryProcessedPenaltiesNew (
		ScoreSheetEntryPenaltyId int NOT NULL,
		SeasonId int NOT NULL,
		TeamId int NOT NULL,
		GameId int NOT NULL,
		Period int NOT NULL,
		HomeTeam bit NOT NULL,
		PlayerId int NOT NULL,
		PenaltyId int NULL,
		TimeRemaining nvarchar(5) NOT NULL,
		TimeElapsed time(7) NULL,
		PenaltyMinutes int NOT NULL,
		BCS int NULL
	)
	CREATE UNIQUE INDEX PK ON #scoreSheetEntryProcessedPenaltiesNew(ScoreSheetEntryPenaltyId)

	INSERT INTO #results
	SELECT
		'ScoreSheetEntryProcessedPenalties' as TableName,
		0 as NewRecordsInserted,
		0 as ExistingRecordsUpdated,
		0 as ExistingRecordsDeleted,
		0 as ProcessedRecordsMatchExistingRecords

	-- PROCESS SCORE SHEET ENTRY GOALS
	INSERT INTO #scoreSheetEntryProcessedPenaltiesNew
	SELECT
		ssep.ScoreSheetEntryPenaltyId,
		gt.SeasonId,
		gt.TeamId,
		gt.GameId,
		ssep.Period,
		ssep.HomeTeam,
		case when grg.PlayerId is null then 0 else grg.PlayerId end,  -- if penalty is unknown, set to unknown player
		p.PenaltyId,
		ssep.TimeRemaining,
		null as TimeElapsed,
		ssep.PenaltyMinutes,
		null as BCS
	FROM
		ScoreSheetEntryPenalties ssep inner join
		Penalties p ON (ssep.PenaltyCode = p.PenaltyCode) inner join
		GameTeams gt on (ssep.GameId = gt.GameId AND ssep.HomeTeam = gt.HomeTeam) left join
		GameRosters grg ON (ssep.GameId = grg.GameId AND gt.TeamId = grg.TeamId AND ssep.Player = grg.PlayerNumber)
	WHERE
		ssep.GameId between @StartingGameId and @EndingGameId

	update #scoreSheetEntryProcessedPenaltiesNew
	set TimeRemaining = replace(timeremaining, '.', ':')

	update #scoreSheetEntryProcessedPenaltiesNew
	set TimeRemaining = '0'+timeremaining
	where SUBSTRING(TimeRemaining, 1, 1) = ':'

	/* audit TimeElapsed components

	drop table #audit

	DECLARE @TimePerPeriod int;
	SET @TimePerPeriod = 14;

	select 
		TimeRemaining,
		TimeRemainingMins = substring(timeremaining,0, PATINDEX('%:%',timeremaining)),
		TimeRemainingSecs = substring(timeremaining, PATINDEX('%:%',timeremaining)+1, LEN(timeremaining)),

		FullPeriodsPlayedMins = (period-1)*@TimePerPeriod,
		TimeElapsedMins = case when substring(timeremaining, PATINDEX('%:%',timeremaining)+1, LEN(timeremaining)) = 0 then (@TimePerPeriod-substring(timeremaining,0, PATINDEX('%:%',timeremaining))) else (@TimePerPeriod-substring(timeremaining,0, PATINDEX('%:%',timeremaining))-1) end,
		TimeElapsedSecs = case when substring(timeremaining, PATINDEX('%:%',timeremaining)+1, LEN(timeremaining)) = 0 then 0 else 60 - substring(timeremaining, PATINDEX('%:%',timeremaining)+1, LEN(timeremaining)) end
    into
		#audit
	from
		#scoreSheetEntryProcessedPenaltiesNew

	select 
		*
	from
		#audit
    where
		TimeRemainingMins < 0 OR TimeRemainingMins > 59 OR
		TimeRemainingSecs < 0 OR TimeRemainingSecs > 59 OR
		FullPeriodsPlayedMins < 0 OR
		TimeElapsedMins < 0 OR TimeElapsedMins > 59 OR
		TimeElapsedSecs < 0 OR TimeElapsedSecs > 59 


	*/

	-- AUDIT Missing Entries
  SELECT
		a.*
  INTO
		#audit   -- just inserting into this table to remove the output to the screen
	FROM
		ScoreSheetEntryPenalties a left join
		#scoreSheetEntryProcessedPenaltiesNew b on (a.ScoreSheetEntryPenaltyId = b.ScoreSheetEntryPenaltyId)
	WHERE
		b.ScoreSheetEntryPenaltyId is null AND
		a.GameId between @StartingGameId and @EndingGameId


	IF (@@ROWCOUNT > 0) 
	BEGIN
		SELECT * FROM #audit
		IF (@@ROWCOUNT > 0) THROW 51000, 'Missing Entries', 1;
	END

	update #scoreSheetEntryProcessedPenaltiesNew
	set
		TimeElapsed = TIMEFROMPARTS(0,
									(period-1)*@TimePerPeriod + 
									case when substring(timeremaining, PATINDEX('%:%',timeremaining)+1, LEN(timeremaining)) = 0 then (@TimePerPeriod-substring(timeremaining,0, PATINDEX('%:%',timeremaining))) else (@TimePerPeriod-substring(timeremaining,0, PATINDEX('%:%',timeremaining))-1) end
									, 
									
									case when substring(timeremaining, PATINDEX('%:%',timeremaining)+1, LEN(timeremaining)) = 0 then 0 else 60 - substring(timeremaining, PATINDEX('%:%',timeremaining)+1, LEN(timeremaining)) end
									,
									
									0, 0)

	
	update #scoreSheetEntryProcessedPenaltiesNew
	set
		BCS = BINARY_CHECKSUM(ScoreSheetEntryPenaltyId,
					SeasonId,
					TeamId,
					GameId,
					Period,
					HomeTeam,
					PlayerId,
					TimeRemaining,
					TimeElapsed,
					PenaltyMinutes)


	INSERT INTO #scoreSheetEntryProcessedPenaltiesCopy
	SELECT 
		ScoreSheetEntryPenaltyId,
		SeasonId,
		TeamId,
		GameId,
		Period,
		HomeTeam,
		PlayerId,
		PenaltyId,
		TimeRemaining,
		TimeElapsed,
		PenaltyMinutes,
		BINARY_CHECKSUM(ScoreSheetEntryPenaltyId,
					SeasonId,
					TeamId,
					GameId,
					Period,
					HomeTeam,
					PlayerId,
					TimeRemaining,
					TimeElapsed,
					PenaltyMinutes) as BCS
	FROM 
		ScoreSheetEntryProcessedPenalties

	IF (@DryRun = 1) 
	BEGIN
		PRINT 'DRY RUN. NOT UPDATING REAL TABLES'
		
		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		delete from #scoreSheetEntryProcessedPenaltiesCopy
		from
			#scoreSheetEntryProcessedPenaltiesCopy c left join
			#scoreSheetEntryProcessedPenaltiesNew n on (c.ScoreSheetEntryPenaltyId = n.ScoreSheetEntryPenaltyId)
		where
			n.GameId is null and
			c.GameId between @StartingGameId and @EndingGameId

		update #results set ExistingRecordsDeleted = @@ROWCOUNT

		update #scoreSheetEntryProcessedPenaltiesCopy
		set
			SeasonId = n.SeasonId,
			TeamId = n.TeamId,
			GameId = n.GameId,
			Period = n.Period,
			HomeTeam = n.HomeTeam,
			PlayerId = n.PlayerId,
			PenaltyId = n.PenaltyId,
			TimeRemaining = n.TimeRemaining,
			TimeElapsed = n.TimeElapsed,
			PenaltyMinutes = n.PenaltyMinutes
		from
			#scoreSheetEntryProcessedPenaltiesCopy c INNER JOIN
			#scoreSheetEntryProcessedPenaltiesNew n ON (c.ScoreSheetEntryPenaltyId = n.ScoreSheetEntryPenaltyId)
		where
		    c.BCS <> n.BCS

		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into #scoreSheetEntryProcessedPenaltiesCopy
		select
			n.*
		from
			#scoreSheetEntryProcessedPenaltiesNew n left join
			#scoreSheetEntryProcessedPenaltiesCopy c ON (c.ScoreSheetEntryPenaltyId = n.ScoreSheetEntryPenaltyId)
		where
			c.GameId is null

		update #results set NewRecordsInserted = @@ROWCOUNT
	END
	ELSE
	BEGIN
		PRINT 'NOT A DRY RUN. UPDATING REAL TABLES'

		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		delete from ScoreSheetEntryProcessedPenalties
		from
			ScoreSheetEntryProcessedPenalties c LEFT JOIN
			#scoreSheetEntryProcessedPenaltiesNew n ON (c.ScoreSheetEntryPenaltyId = n.ScoreSheetEntryPenaltyId)
		where
			n.GameId is null and
			c.GameId between @StartingGameId and @EndingGameId

		update #results set ExistingRecordsDeleted = @@ROWCOUNT

		update ScoreSheetEntryProcessedPenalties
		set
			SeasonId = n.SeasonId,
			TeamId = n.TeamId,
			GameId = n.GameId,
			Period = n.Period,
			HomeTeam = n.HomeTeam,
			PlayerId = n.PlayerId,
			PenaltyId = n.PenaltyId,
			TimeRemaining = n.TimeRemaining,
			TimeElapsed = n.TimeElapsed,
			PenaltyMinutes = n.PenaltyMinutes,
			UpdatedOn = GETDATE()
		from
			ScoreSheetEntryProcessedPenalties r INNER JOIN
			#scoreSheetEntryProcessedPenaltiesCopy c ON (r.ScoreSheetEntryPenaltyId = c.ScoreSheetEntryPenaltyId) INNER JOIN
			#scoreSheetEntryProcessedPenaltiesNew n ON (c.ScoreSheetEntryPenaltyId = n.ScoreSheetEntryPenaltyId)
		where
		    c.BCS <> n.BCS
			
		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into ScoreSheetEntryProcessedPenalties(ScoreSheetEntryPenaltyId,
			SeasonId,
			TeamId,
			GameId,
			Period,
			HomeTeam,
			PlayerId,
			PenaltyId,
			TimeRemaining,
			TimeElapsed,
			PenaltyMinutes,
			UpdatedOn)
		select
			n.ScoreSheetEntryPenaltyId,
			n.SeasonId,
			n.TeamId,
			n.GameId,
			n.Period,
			n.HomeTeam,
			n.PlayerId,
			n.PenaltyId,
			n.TimeRemaining,
			n.TimeElapsed,
			n.PenaltyMinutes,
			GETDATE()
		from
			#scoreSheetEntryProcessedPenaltiesNew n left join
			ScoreSheetEntryProcessedPenalties c ON (c.ScoreSheetEntryPenaltyId = n.ScoreSheetEntryPenaltyId)
		where
			c.GameId is null
        order by
		    n.GameId,
			n.Period,
			n.TimeElapsed


		update #results set NewRecordsInserted = @@ROWCOUNT
	END

	update #results set ProcessedRecordsMatchExistingRecords = (select count(*) from #scoreSheetEntryProcessedPenaltiesNew) - NewRecordsInserted - ExistingRecordsUpdated

	select * from #results
	 
END TRY
BEGIN CATCH
    THROW;
END CATCH;
