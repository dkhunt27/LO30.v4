
--DROP PROCEDURE [dbo].[DeriveGameScores]

CREATE PROCEDURE dbo.DeriveGameScores
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
	IF OBJECT_ID('tempdb..#periods') IS NOT NULL DROP TABLE #periods
	IF OBJECT_ID('tempdb..#gameScoresTemp') IS NOT NULL DROP TABLE #gameScoresTemp
	IF OBJECT_ID('tempdb..#gameScoresCopy') IS NOT NULL DROP TABLE #gameScoresCopy
	IF OBJECT_ID('tempdb..#gameScoresNew') IS NOT NULL DROP TABLE #gameScoresNew

	CREATE TABLE #results (
		TableName nvarchar(35) NOT NULL,
		NewRecordsInserted int NOT NULL,
		ExistingRecordsUpdated int NOT NULL,
		ExistingRecordsDeleted int NOT NULL,
		ProcessedRecordsMatchExistingRecords int NOT NULL
	)

	CREATE TABLE #periods (
		Period int NOT NULL
	)
	INSERT INTO #periods values(1)
	INSERT INTO #periods values(2)
	INSERT INTO #periods values(3)

	CREATE TABLE #gameScoresTemp (
		GameId int NOT NULL,
		TeamId int NOT NULL,
		Period int NOT NULL,
		Score int NOT NULL,
		SeasonId int NOT NULL
	)

	CREATE TABLE #gameScoresCopy (
		GameId int NOT NULL,
		TeamId int NOT NULL,
		Period int NOT NULL,
		Score int NOT NULL,
		SeasonId int NOT NULL,
		BCS int NULL
	)
	CREATE UNIQUE INDEX PK ON #gameScoresCopy(GameId, TeamId, Period)

	CREATE TABLE #gameScoresNew (
		GameId int NOT NULL,
		TeamId int NOT NULL,
		Period int NOT NULL,
		Score int NOT NULL,
		SeasonId int NOT NULL,
		BCS int NULL
	)
	CREATE UNIQUE INDEX PK ON #gameScoresNew(GameId, TeamId, Period)

	INSERT INTO #results
	SELECT
		'GameScores' as TableName,
		0 as NewRecordsInserted,
		0 as ExistingRecordsUpdated,
		0 as ExistingRecordsDeleted,
		0 as ProcessedRecordsMatchExistingRecords


	-- 'Count of possible games scores (games to process x 6)'
	INSERT INTO #gameScoresTemp
	SELECT
		gt.GameId,
		gt.TeamId,
		p.Period,
		0 as Score,
		gt.SeasonId
	FROM
		GameTeams gt,
		#periods p
	WHERE
		gt.GameId between @StartingGameId and @EndingGameId
	ORDER BY
		1,2

	-- 'Count of actual games scores'
	INSERT INTO #gameScoresTemp
	SELECT
		gt.GameId,
		gt.TeamId,
		ssepg.Period,
		count(*) as Score,
		gt.SeasonId
	FROM
		GameTeams gt INNER JOIN
		ScoreSheetEntryProcessedGoals ssepg ON (gt.GameId = ssepg.GameId AND gt.HomeTeam = ssepg.HomeTeam)
	WHERE
		gt.GameId between @StartingGameId and @EndingGameId
	GROUP BY
		gt.GameId,
		gt.TeamId,
		ssepg.Period,
		gt.SeasonId

	-- 'Count of actual games ... total/final scores'
	INSERT INTO #gameScoresTemp
	SELECT
		gt.GameId,
		gt.TeamId,
		0 Period,
		sum(Score) as Score,
		gt.SeasonId
	FROM
		#gameScoresTemp gt
	GROUP BY
		gt.GameId,
		gt.TeamId,
		gt.SeasonId

	--'Count of all games scores (games to process x 6)'
	INSERT INTO #gameScoresNew
	SELECT
		GameId,
		TeamId,
		Period,
		sum(Score) as Score,
		SeasonId,
		NULL as BCS
	FROM
		#gameScoresTemp
	GROUP BY
		GameId,
		TeamId,
		Period,
		SeasonId
	
	update #gameScoresNew
	set
		BCS = BINARY_CHECKSUM(GameId,
					TeamId,
					Period,
					Score,
					SeasonId)

	-- 'Count Copying GameScores'
	INSERT INTO #gameScoresCopy
	SELECT 
		GameId,
		TeamId,
		Period,
		Score,
		SeasonId,
		BINARY_CHECKSUM(GameId,
					TeamId,
					Period,
					Score,
					SeasonId) as BCS
	FROM 
		GameScores

	IF (@DryRun = 1) 
	BEGIN
		PRINT 'DRY RUN. NOT UPDATING REAL TABLES'

    /* Audit records change
			select * from #gameScoresCopy where GameId = 3372
			select * from #gameScoresNew where GameId = 3372
		*/
		
		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		delete from #gameScoresCopy
		from
			#gameScoresCopy c left join
			#gameScoresNew n on (c.GameId = n.GameId AND c.TeamId = n.TeamId AND c.Period = n.Period)
		where
			n.GameId is null and
			c.GameId between @StartingGameId and @EndingGameId

		update #results set ExistingRecordsDeleted = @@ROWCOUNT

		update #gameScoresCopy
		set
			Score = n.Score,
			SeasonId = n.SeasonId
		from
			#gameScoresCopy c INNER JOIN
			#gameScoresNew n ON (c.GameId = n.GameId AND c.TeamId = n.TeamId AND c.Period = n.Period)
		where
		    c.BCS <> n.BCS


		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into #gameScoresCopy
		select
			n.*
		from
			#gameScoresNew n LEFT JOIN
			#gameScoresCopy c ON (c.GameId = n.GameId AND c.TeamId = n.TeamId AND c.Period = n.Period)
		where
			c.GameId is null

		update #results set NewRecordsInserted = @@ROWCOUNT
	END
	ELSE
	BEGIN
		PRINT 'NOT A DRY RUN. UPDATING REAL TABLES'

		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		delete from GameScores
		from
			GameScores c LEFT JOIN
			#gameScoresNew n ON (c.GameId = n.GameId AND c.TeamId = n.TeamId AND c.Period = n.Period)
		where
			n.GameId is null and
			c.GameId between @StartingGameId and @EndingGameId

		update #results set ExistingRecordsDeleted = @@ROWCOUNT

		update GameScores
		set
			Score = n.Score,
			SeasonId = n.SeasonId
		from
			GameScores r INNER JOIN
			#gameScoresCopy c ON (r.GameId = c.GameId AND r.TeamId = c.TeamId AND r.Period = c.Period) INNER JOIN
			#gameScoresNew n ON (c.GameId = n.GameId AND c.TeamId = n.TeamId AND c.Period = n.Period)
		where
		    c.BCS <> n.BCS

		update #results set ExistingRecordsUpdated = @@ROWCOUNT


		insert into GameScores
		select
			n.GameId,
			n.TeamId,
			n.Period,
			n.Score,
			n.SeasonId
		from
			#gameScoresNew n left join
			GameScores c ON (c.GameId = n.GameId AND c.TeamId = n.TeamId AND c.Period = n.Period)
		where
			c.GameId is null
        order by
		    n.GameId,
			n.Period


		update #results set NewRecordsInserted = @@ROWCOUNT
	END

	update #results set ProcessedRecordsMatchExistingRecords = (select count(*) from #gameScoresNew) - NewRecordsInserted - ExistingRecordsUpdated

	select * from #results
	 
END TRY
BEGIN CATCH
    THROW;
END CATCH;

