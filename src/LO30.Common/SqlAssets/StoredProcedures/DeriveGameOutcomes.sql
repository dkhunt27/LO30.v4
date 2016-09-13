
--DROP PROCEDURE [dbo].[DeriveGameOutcomes]

CREATE PROCEDURE dbo.DeriveGameOutcomes
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
	IF OBJECT_ID('tempdb..#gamePIMs') IS NOT NULL DROP TABLE #gamePIMs
	IF OBJECT_ID('tempdb..#gameOutcomesCopy') IS NOT NULL DROP TABLE #gameOutcomesCopy
	IF OBJECT_ID('tempdb..#gameOutcomesNew') IS NOT NULL DROP TABLE #gameOutcomesNew

	CREATE TABLE #results (
		TableName nvarchar(35) NOT NULL,
		NewRecordsInserted int NOT NULL,
		ExistingRecordsUpdated int NOT NULL,
		ExistingRecordsDeleted int NOT NULL,
		ProcessedRecordsMatchExistingRecords int NOT NULL
	)

	CREATE TABLE #gamePIMs (
		GameId int NOT NULL,
		TeamId int NOT NULL,
		PIM int NOT NULL
	)

	CREATE TABLE #gameOutcomesNew (
		GameId int NOT NULL,
		TeamId int NOT NULL,
		HomeTeam bit NOT NULL,
		Outcome nvarchar(1) NOT NULL,
		GoalsFor int NOT NULL,
		GoalsAgainst int NOT NULL,
		PenaltyMinutes int NOT NULL,
		Subs int NOT NULL,
		Overriden bit NOT NULL,
		OpponentTeamId int NOT NULL,
		SeasonId int NOT NULL,
		BCS int NULL
	)
	CREATE UNIQUE INDEX PK ON #gameOutcomesNew(GameId, TeamId)

	CREATE TABLE #gameOutcomesCopy (
		GameId int NOT NULL,
		TeamId int NOT NULL,
		HomeTeam bit NOT NULL,
		Outcome nvarchar(1) NOT NULL,
		GoalsFor int NOT NULL,
		GoalsAgainst int NOT NULL,
		PenaltyMinutes int NOT NULL,
		Subs int NOT NULL,
		Overriden bit NOT NULL,
		OpponentTeamId int NOT NULL,
		SeasonId int NOT NULL,
		BCS int NULL
	)
	CREATE UNIQUE INDEX PK ON #gameOutcomesCopy(GameId, TeamId)

	INSERT INTO #results
	SELECT
		'GameOutcomes' as TableName,
		0 as NewRecordsInserted,
		0 as ExistingRecordsUpdated,
		0 as ExistingRecordsDeleted,
		0 as ProcessedRecordsMatchExistingRecords

	-- 'Count GamePIMS (records <= games to process x 2)'
	INSERT INTO #gamePIMs
	SELECT
		gt.GameId,
		gt.TeamId, 
		sum(ssepp.PenaltyMinutes) as PIM
	FROM
		GameTeams gt INNER JOIN
		ScoreSheetEntryProcessedPenalties ssepp on (gt.GameId = ssepp.GameId AND gt.HomeTeam = ssepp.HomeTeam)
	WHERE
		gt.GameId between @StartingGameId and @EndingGameId
	GROUP BY
		gt.GameId,
		gt.TeamId

	-- 'Count GameOutComes (games to process x 2)'
	INSERT INTO #gameOutcomesNew
	SELECT
		gt.GameId,
		gt.TeamId, 
		gt.HomeTeam,
		case 
			when gs1.Score > gs2.Score then 'W'
			when gs1.Score < gs2.Score then 'L'
			else 'T'
		end as 'Outcome',
		gs1.Score as GoalsFor,
		gs2.Score as GoalsAgainst,
		case when gp.PIM is null then 0 else gp.PIM end as PenaltyMinutes,
		case when sub.Subs is null then 0 else sub.Subs end as Subs,
		0 as Overriden,
		gt.OpponentTeamId,
		gt.SeasonId,
		NULL as BCS
	FROM
		GameTeams gt inner join
		GameScores gs1 on (gt.GameId = gs1.GameId AND gt.TeamId = gs1.TeamId AND gs1.Period = 0) inner join
		GameScores gs2 on (gt.GameId = gs2.GameId AND gt.OpponentTeamId = gs2.TeamId AND gs2.Period = 0) left join
		#gamePIMs gp on (gt.GameId = gp.GameId AND gt.TeamId = gp.TeamId) left join
		(SELECT 
			GameId, 
			TeamId, 
			count(SubbingForPlayerId) as Subs
		FROM 
			GameRosters 
		WHERE 
			SubbingForPlayerId is not null 
		GROUP BY
			GameId, 
			TeamId) sub on (gt.GameId = sub.GameId AND gt.TeamId = sub.TeamId)
	WHERE
		gt.GameId between @StartingGameId and @EndingGameId
	ORDER BY
		gt.GameId,
		gt.TeamId

	-- update any overrides
	UPDATE #gameOutcomesNew
	SET
		Overriden = 1,
		Outcome = goo.Outcome
	FROM
		#gameOutcomesNew gout INNER JOIN
		GameOutcomeOverrides goo ON (gout.GameId = goo.GameId and gout.TeamId = goo.TeamId)


	update #gameOutcomesNew
	set
		BCS = BINARY_CHECKSUM(GameId,
								TeamId, 
								HomeTeam,
								Outcome,
								GoalsFor,
								GoalsAgainst,
								PenaltyMinutes,
								Subs,
								Overriden,
								OpponentTeamId,
								SeasonId)

	-- 'Count Copying GameOutcomes'
	INSERT INTO #gameOutcomesCopy
	SELECT 
		GameId,
		TeamId, 
		HomeTeam,
		Outcome,
		GoalsFor,
		GoalsAgainst,
		PenaltyMinutes,
		Subs,
		Overriden,
		OpponentTeamId,
		SeasonId,
		BINARY_CHECKSUM(GameId,
							TeamId, 
							HomeTeam,
							Outcome,
							GoalsFor,
							GoalsAgainst,
							PenaltyMinutes,
							Subs,
							Overriden,
							OpponentTeamId,
							SeasonId) as BCS
	FROM 
		GameOutcomes

	IF (@dryrun = 1) 
	BEGIN
		-- this is not a dry run
		PRINT 'DRY RUN. NOT UPDATING REAL TABLES'
		
		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		delete from #gameOutcomesCopy
		from
			#gameOutcomesCopy c left join
			#gameOutcomesNew n on (c.GameId = n.GameId AND c.TeamId = n.TeamId)
		where
			n.GameId is null and
			c.GameId between @StartingGameId and @EndingGameId

		update #results set ExistingRecordsDeleted = @@ROWCOUNT

		update #gameOutcomesCopy
		set
			HomeTeam = n.HomeTeam,
			Outcome = n.Outcome,
			GoalsFor = n.GoalsFor,
			GoalsAgainst = n.GoalsAgainst,
			PenaltyMinutes = n.PenaltyMinutes,
			Subs = n.Subs,
			Overriden = n.Overriden,
			OpponentTeamId = n.OpponentTeamId,
			SeasonId = n.SeasonId
		from
			#gameOutcomesCopy c INNER JOIN
			#gameOutcomesNew n ON (c.GameId = n.GameId AND c.TeamId = n.TeamId)
		where
		    c.BCS <> n.BCS

		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		INSERT INTO #gameOutcomesCopy
		SELECT
			n.*
		FROM
			#gameOutcomesNew n left join
			#gameOutcomesCopy c on (c.GameId = n.GameId AND c.TeamId = n.TeamId)
		WHERE
			c.GameId is null

		update #results set NewRecordsInserted = @@ROWCOUNT
	END
	ELSE
	BEGIN
		-- this is not a dry run
		PRINT 'NOT A DRY RUN. UPDATING REAL TABLES'

		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		delete from GameOutcomes
		from
			GameOutcomes c LEFT JOIN
			#gameOutcomesNew n ON (c.GameId = n.GameId AND c.TeamId = n.TeamId)
		where
			n.GameId is null and
			c.GameId between @StartingGameId and @EndingGameId

		update #results set ExistingRecordsDeleted = @@ROWCOUNT

		update GameOutcomes
		set
			HomeTeam = n.HomeTeam,
			Outcome = n.Outcome,
			GoalsFor = n.GoalsFor,
			GoalsAgainst = n.GoalsAgainst,
			PenaltyMinutes = n.PenaltyMinutes,
			Subs = n.Subs,
			Overriden = n.Overriden,
			OpponentTeamId = n.OpponentTeamId,
			SeasonId = n.SeasonId
		from
			GameOutcomes r INNER JOIN
			#gameOutcomesCopy c ON (r.GameId = c.GameId AND r.TeamId = c.TeamId) INNER JOIN
			#gameOutcomesNew n ON (c.GameId = n.GameId AND c.TeamId = n.TeamId)
		where
		    c.BCS <> n.BCS

		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		INSERT INTO GameOutcomes (GameId,
			TeamId, 
			HomeTeam,
			Outcome,
			GoalsFor,
			GoalsAgainst,
			PenaltyMinutes,
			Subs,
			Overriden,
			OpponentTeamId,
			SeasonId
		)
		SELECT
			n.GameId,
			n.TeamId, 
			n.HomeTeam,
			n.Outcome,
			n.GoalsFor,
			n.GoalsAgainst,
			n.PenaltyMinutes,
			n.Subs,
			n.Overriden,
			n.OpponentTeamId,
			n.SeasonId
		FROM
			#gameOutcomesNew n left join
			GameOutcomes c on (c.GameId = n.GameId AND c.TeamId = n.TeamId)
		WHERE
			c.GameId is null

		update #results set NewRecordsInserted = @@ROWCOUNT
	END

	update #results set ProcessedRecordsMatchExistingRecords = (SELECT count(*) from #gameOutcomesNew) - NewRecordsInserted - ExistingRecordsUpdated

	SELECT * from #results

END TRY
BEGIN CATCH
    THROW;
END CATCH;


