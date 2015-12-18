
--DROP PROCEDURE [dbo].[DeriveScoreSheetEntryProcessedSubs]

CREATE PROCEDURE dbo.DeriveScoreSheetEntryProcessedSubs
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

	DECLARE @TimePerPeriod int;
	SET @TimePerPeriod = 14;

	-- SeasonId 54 Playoffs False
	SET @StartingGameId = 3200;
	--SET @EndingGameId = 3319;

	-- SeasonId 54 Playoffs True
	--SET @StartingGameId = 3324;
	SET @EndingGameId = 3372;

	SET @DryRun = 0;
-- STOP comment this out when saving as stored proc
*/

	IF OBJECT_ID('tempdb..#results') IS NOT NULL DROP TABLE #results
	IF OBJECT_ID('tempdb..#scoreSheetEntryProcessedSubsCopy') IS NOT NULL DROP TABLE #scoreSheetEntryProcessedSubsCopy
	IF OBJECT_ID('tempdb..#scoreSheetEntryProcessedSubsNew') IS NOT NULL DROP TABLE #scoreSheetEntryProcessedSubsNew

	CREATE TABLE #results (
		TableName nvarchar(35) NOT NULL,
		NewRecordsInserted int NOT NULL,
		ExistingRecordsUpdated int NOT NULL,
		ExistingRecordsDeleted int NOT NULL,
		ProcessedRecordsMatchExistingRecords int NOT NULL
	)

	CREATE TABLE #scoreSheetEntryProcessedSubsCopy (
		ScoreSheetEntrySubId int NOT NULL,
		SeasonId int NOT NULL,
		TeamId int NOT NULL,
		GameId int NOT NULL,
		SubPlayerId int NOT NULL,
		SubbingForPlayerId int NOT NULL,
		HomeTeam bit NOT NULL,
		JerseyNumber nvarchar(5) NOT NULL,
		BCS int NULL
	)
	CREATE UNIQUE INDEX PK ON #scoreSheetEntryProcessedSubsCopy(ScoreSheetEntrySubId)

	CREATE TABLE #scoreSheetEntryProcessedSubsNew (
		ScoreSheetEntrySubId int NOT NULL,
		SeasonId int NOT NULL,
		TeamId int NOT NULL,
		GameId int NOT NULL,
		SubPlayerId int NOT NULL,
		SubbingForPlayerId int NOT NULL,
		HomeTeam bit NOT NULL,
		JerseyNumber nvarchar(5) NOT NULL,
		BCS int NULL
	)
	CREATE UNIQUE INDEX PK ON #scoreSheetEntryProcessedSubsNew(ScoreSheetEntrySubId)

	INSERT INTO #results
	SELECT
		'ScoreSheetEntryProcessedSubs' as TableName,
		0 as NewRecordsInserted,
		0 as ExistingRecordsUpdated,
		0 as ExistingRecordsDeleted,
		0 as ProcessedRecordsMatchExistingRecords

	INSERT INTO #scoreSheetEntryProcessedSubsNew
	SELECT
		sses.ScoreSheetEntrySubId,
		gt.SeasonId,
		gt.TeamId,
		sses.GameId,
		p.PlayerId,
		ps.PlayerId,
		sses.HomeTeam,
		sses.JerseyNumber,
		null as BCS
	FROM
		ScoreSheetEntrySubs sses inner join
		GameTeams gt on (sses.GameId = gt.GameId AND sses.HomeTeam = gt.HomeTeam) inner join
		Players p ON (sses.SubPlayerId = p.PlayerId) inner join
		Players ps ON (sses.SubbingForPlayerId = ps.PlayerId)   -- cannot use gameroster since this table is used to create the gameroster later
	WHERE
		sses.GameId between @StartingGameId and @EndingGameId

	/* audit incorrect sub/subbingfor player ids

	SELECT
		*
	FROM
		ScoreSheetEntrySubs sses inner join
		GameTeams gt on (sses.GameId = gt.GameId AND sses.HomeTeam = gt.HomeTeam) left join
		Players p ON (sses.SubPlayerId = p.PlayerId) left join
		Players ps ON (sses.SubbingForPlayerId = ps.PlayerId) 
	WHERE
		sses.GameId between @StartingGameId and @EndingGameId and
		(p.PlayerId is null or ps.PlayerId is null)

	*/
	
	update #scoreSheetEntryProcessedSubsNew
	set
		BCS = BINARY_CHECKSUM(ScoreSheetEntrySubId,
									SeasonId,
									TeamId,
									GameId,
									SubPlayerId,
									SubbingForPlayerId,
									HomeTeam,
									JerseyNumber)

	-- AUDIT Duplicate Subbing Players
	INSERT INTO #scoreSheetEntryProcessedSubsCopy   -- just inserting into this table to remove the output to the screen
  SELECT
		a.*
	FROM
		#scoreSheetEntryProcessedSubsNew a INNER JOIN
		#scoreSheetEntryProcessedSubsNew b ON (a.SeasonId = b.SeasonId AND a.TeamId = b.TeamId AND a.GameId = b.GameId AND a.SubPlayerId = b.SubPlayerId)
	WHERE
		a.SubbingForPlayerId <> b.SubbingForPlayerId
    ORDER BY
		a.SeasonId,
		a.GameId,
		a.TeamId,
		a.SubPlayerId,
		a.SubbingForPlayerId

	IF (@@ROWCOUNT > 0) THROW 51000, 'Duplicate Subbing For Player Ids', 1;

	/* THIS IS ALLOWED BECAUSE A SUB CAN BE LATE AND ANOTHER PLAYER HAS TO SUB FOR HIM...
			SEE GAME 3216 KEN HUNT (38) STAYED A FEW SHIFTS CAUSE DAN CREUTU (655) WAS LATE; BOTH SUBBED FOR ROB SMYTHE (20)

	PRINT ' '
	PRINT 'AUDIT Duplicate Sub Player Ids'
    SELECT
		*
	FROM
		#scoreSheetEntryProcessedSubsNew a INNER JOIN
		#scoreSheetEntryProcessedSubsNew b ON (a.SeasonId = b.SeasonId AND a.TeamId = b.TeamId AND a.GameId = b.GameId AND a.SubbingForPlayerId = b.SubbingForPlayerId)
	WHERE
		a.SubPlayerId <> b.SubPlayerId
    ORDER BY
		a.SeasonId,
		a.GameId,
		a.TeamId,
		a.SubPlayerId,
		a.SubbingForPlayerId

	IF (@@ROWCOUNT > 0) THROW 51000, 'Duplicate Sub Player Ids', 1;
	*/

	-- AUDIT Duplicate PK2
	INSERT INTO #scoreSheetEntryProcessedSubsCopy    -- just inserting into this table to remove the output to the screen
  SELECT
		a.*
	FROM
		#scoreSheetEntryProcessedSubsNew a INNER JOIN
		#scoreSheetEntryProcessedSubsNew b ON (a.SeasonId = b.SeasonId AND a.TeamId = b.TeamId AND a.GameId = b.GameId AND a.SubPlayerId = b.SubPlayerId AND a.SubbingForPlayerId = b.SubbingForPlayerId)
	WHERE
		a.ScoreSheetEntrySubId <> b.ScoreSheetEntrySubId
    ORDER BY
		a.SeasonId,
		a.GameId,
		a.TeamId,
		a.SubPlayerId,
		a.SubbingForPlayerId

	IF (@@ROWCOUNT > 0) 
	BEGIN
		SELECT * FROM #scoreSheetEntryProcessedSubsCopy
		IF (@@ROWCOUNT > 0) THROW 51000, 'Duplicate PK2', 1;
	END

	INSERT INTO #scoreSheetEntryProcessedSubsCopy
	SELECT 
		ScoreSheetEntrySubId,
		SeasonId,
		TeamId,
		GameId,
		SubPlayerId,
		SubbingForPlayerId,
		HomeTeam,
		JerseyNumber,
		BINARY_CHECKSUM(ScoreSheetEntrySubId,
							SeasonId,
							TeamId,
							GameId,
							SubPlayerId,
							SubbingForPlayerId,
							HomeTeam,
							JerseyNumber) as BCS
	FROM 
		ScoreSheetEntryProcessedSubs

	IF (@DryRun = 1) 
	BEGIN
		PRINT 'DRY RUN. NOT UPDATING REAL TABLES'

    /* Audit records change
			select * from #scoreSheetEntryProcessedSubsCopy where GameId = 3367
			select * from #scoreSheetEntryProcessedSubsNew where GameId = 3367
		*/
		
		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		delete from #scoreSheetEntryProcessedSubsCopy
		from
			#scoreSheetEntryProcessedSubsCopy c left join
			#scoreSheetEntryProcessedSubsNew n on (c.ScoreSheetEntrySubId = n.ScoreSheetEntrySubId)
		where
			n.GameId is null and
			c.GameId between @StartingGameId and @EndingGameId

		update #results set ExistingRecordsDeleted = @@ROWCOUNT

		update #scoreSheetEntryProcessedSubsCopy
		set
			SeasonId = n.SeasonId,
			TeamId = n.TeamId,
			GameId = n.GameId,
			SubPlayerId = n.SubPlayerId,
			SubbingForPlayerId = n.SubbingForPlayerId,
			HomeTeam = n.HomeTeam,
			JerseyNumber = n.JerseyNumber
		from
			#scoreSheetEntryProcessedSubsCopy c INNER JOIN
			#scoreSheetEntryProcessedSubsNew n ON (c.ScoreSheetEntrySubId = n.ScoreSheetEntrySubId)
		where
		    c.BCS <> n.BCS

		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into #scoreSheetEntryProcessedSubsCopy
		select
			n.*
		from
			#scoreSheetEntryProcessedSubsNew n LEFT JOIN
			#scoreSheetEntryProcessedSubsCopy c ON (n.ScoreSheetEntrySubId = c.ScoreSheetEntrySubId)
		where
			c.GameId is null

		update #results set NewRecordsInserted = @@ROWCOUNT
	END
	ELSE
	BEGIN
		PRINT 'NOT A DRY RUN. UPDATING REAL TABLES'

		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		delete from ScoreSheetEntryProcessedSubs
		from
			ScoreSheetEntryProcessedSubs c LEFT JOIN
			#scoreSheetEntryProcessedSubsNew n ON (c.ScoreSheetEntrySubId = n.ScoreSheetEntrySubId)
		where
			n.GameId is null and
			c.GameId between @StartingGameId and @EndingGameId

		update #results set ExistingRecordsDeleted = @@ROWCOUNT

		update ScoreSheetEntryProcessedSubs
		set
			SeasonId = n.SeasonId,
			TeamId = n.TeamId,
			GameId = n.GameId,
			SubPlayerId = n.SubPlayerId,
			SubbingForPlayerId = n.SubbingForPlayerId,
			HomeTeam = n.HomeTeam,
			JerseyNumber = n.JerseyNumber,
			UpdatedOn = GETDATE()
		from
			ScoreSheetEntryProcessedSubs r INNER JOIN
			#scoreSheetEntryProcessedSubsCopy c ON (r.ScoreSheetEntrySubId = c.ScoreSheetEntrySubId) INNER JOIN
			#scoreSheetEntryProcessedSubsNew n ON (c.ScoreSheetEntrySubId = n.ScoreSheetEntrySubId)
		where
		    c.BCS <> n.BCS
			
		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into ScoreSheetEntryProcessedSubs
		select
			n.ScoreSheetEntrySubId,
			n.SeasonId,
			n.TeamId,
			n.GameId,
			n.SubPlayerId,
			n.SubbingForPlayerId,
			n.HomeTeam,
			n.JerseyNumber,
			GETDATE()
		from
			#scoreSheetEntryProcessedSubsNew n LEFT JOIN
			ScoreSheetEntryProcessedSubs c ON (n.ScoreSheetEntrySubId = c.ScoreSheetEntrySubId)
		where
			c.GameId is null
        order by
			n.ScoreSheetEntrySubId


		update #results set NewRecordsInserted = @@ROWCOUNT
	END

	update #results set ProcessedRecordsMatchExistingRecords = (select count(*) from #scoreSheetEntryProcessedSubsNew) - NewRecordsInserted - ExistingRecordsUpdated

	select * from #results
	 
END TRY
BEGIN CATCH
    THROW;
END CATCH;
