
--DROP PROCEDURE [dbo].[DeriveScoreSheetEntryProcessedPlusMinuses]

CREATE PROCEDURE dbo.DeriveScoreSheetEntryProcessedPlusMinuses
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

	SET @StartingGameId = 3616;
	SET @EndingGameId = 3667;

	SET @DryRun = 0;
-- STOP comment this out when saving as stored proc
*/

	IF OBJECT_ID('tempdb..#results') IS NOT NULL DROP TABLE #results
	IF OBJECT_ID('tempdb..#scoreSheetEntryProcessedPlusMinusesCopy') IS NOT NULL DROP TABLE #scoreSheetEntryProcessedPlusMinusesCopy
	IF OBJECT_ID('tempdb..#scoreSheetEntryProcessedPlusMinusesNew') IS NOT NULL DROP TABLE #scoreSheetEntryProcessedPlusMinusesNew
	IF OBJECT_ID('tempdb..#unknownGoals') IS NOT NULL DROP TABLE #unknownGoals

	CREATE TABLE #results (
		TableName nvarchar(35) NOT NULL,
		NewRecordsInserted int NOT NULL,
		ExistingRecordsUpdated int NOT NULL,
		ExistingRecordsDeleted int NOT NULL,
		ProcessedRecordsMatchExistingRecords int NOT NULL
	)

	CREATE TABLE #scoreSheetEntryProcessedPlusMinusesCopy (
		ScoreSheetEntryGoalId int NOT NULL,
		SeasonId int NOT NULL,
		GameId int NOT NULL,
		TeamId int NOT NULL, 
		Line int NOT NULL,
		PlusMinus int NOT NULL,
		BCS int NULL
	)
	CREATE UNIQUE INDEX PK ON #scoreSheetEntryProcessedPlusMinusesCopy(ScoreSheetEntryGoalId, TeamId)

	CREATE TABLE #scoreSheetEntryProcessedPlusMinusesNew (
		ScoreSheetEntryGoalId int NOT NULL,
		SeasonId int NOT NULL,
		GameId int NOT NULL,
		TeamId int NOT NULL, 
		Line int NOT NULL,
		PlusMinus int NOT NULL,
		BCS int NULL
	)
	CREATE UNIQUE INDEX PK ON #scoreSheetEntryProcessedPlusMinusesNew(ScoreSheetEntryGoalId, TeamId)

	CREATE TABLE #unknownGoals (
		ScoreSheetEntryGoalId int NOT NULL,
		SeasonId int NOT NULL,
		GameId int NOT NULL,
		TeamId int NOT NULL, 
		Line int NOT NULL,
		PlusMinus int NOT NULL,
		BCS int NULL
	)
	CREATE UNIQUE INDEX PK ON #unknownGoals(ScoreSheetEntryGoalId, TeamId)

	INSERT INTO #results
	SELECT
		'ScoreSheetEntryProcessedPlusMinuses' as TableName,
		0 as NewRecordsInserted,
		0 as ExistingRecordsUpdated,
		0 as ExistingRecordsDeleted,
		0 as ProcessedRecordsMatchExistingRecords

	-- PROCESS SCORE SHEET ENTRY PLUSES
	INSERT INTO #scoreSheetEntryProcessedPlusMinusesNew
	SELECT
		ssepg.ScoreSheetEntryGoalId,
		ssepg.SeasonId,
		ssepg.GameId,
		gr.TeamId,
		gr.Line,
		1 as PlusMinus,
		null as BCS
	FROM
		ScoreSheetEntryProcessedGoals ssepg inner join
		GameRosters gr ON (ssepg.GameId = gr.GameId AND ssepg.TeamId = gr.TeamId AND ssepg.GoalPlayerId = gr.PlayerId)
	WHERE
		ssepg.GameId between @StartingGameId and @EndingGameId

	-- PROCESS SCORE SHEET ENTRY MINUSES
	INSERT INTO #scoreSheetEntryProcessedPlusMinusesNew
	SELECT
		ssepg.ScoreSheetEntryGoalId,
		ssepg.SeasonId,
		ssepg.GameId,
		gt.OpponentTeamId,
		gr.Line,
		-1 as PlusMinus,
		null as BCS
	FROM
		ScoreSheetEntryProcessedGoals ssepg inner join
		GameRosters gr ON (ssepg.GameId = gr.GameId AND ssepg.TeamId = gr.TeamId AND ssepg.GoalPlayerId = gr.PlayerId) INNER JOIN
		GameTeams gt ON (gr.GameId = gt.GameId AND gr.TeamId = gt.TeamId)
	WHERE
		ssepg.GameId between @StartingGameId and @EndingGameId

    -- assume line 1 for goals...manual adjustment to other lines
	insert into #unknownGoals
	SELECT
		ssepg.ScoreSheetEntryGoalId,
		ssepg.SeasonId,
		ssepg.GameId,
		ssepg.TeamId,
		1 as Line,
		1 as PlusMinus,
		null as BCS
	FROM
		ScoreSheetEntryProcessedGoals ssepg left join
		GameRosters gr ON (ssepg.GameId = gr.GameId AND ssepg.TeamId = gr.TeamId AND ssepg.GoalPlayerId = gr.PlayerId)
	WHERE
		ssepg.GameId between @StartingGameId and @EndingGameId AND
		gr.GameId is null

	INSERT INTO #unknownGoals
	SELECT
		ssepg.ScoreSheetEntryGoalId,
		ssepg.SeasonId,
		ssepg.GameId,
		gt.OpponentTeamId,
		1 as Line,
		-1 as PlusMinus,
		null as BCS
	FROM
		ScoreSheetEntryProcessedGoals ssepg inner join
		GameTeams gt ON (ssepg.GameId = gt.GameId AND ssepg.TeamId = gt.TeamId) left join
		GameRosters gr ON (ssepg.GameId = gr.GameId AND ssepg.TeamId = gr.TeamId AND ssepg.GoalPlayerId = gr.PlayerId)
	WHERE
		ssepg.GameId between @StartingGameId and @EndingGameId AND
		gr.GameId is null

    /* use the following to research
		select * from #unknownGoals order by GameId
		http://livoniaover30hockey.com/#/r/gameBoxScore/games/3617/seasons/57
	*/

	update #scoreSheetEntryProcessedPlusMinusesNew
	set
		BCS = BINARY_CHECKSUM(ScoreSheetEntryGoalId,
					SeasonId,
					GameId,
					TeamId,
					Line,
					PlusMinus)


	INSERT INTO #scoreSheetEntryProcessedPlusMinusesCopy
	SELECT 
		ScoreSheetEntryGoalId,
		SeasonId,
		GameId,
		TeamId,
		Line,
		PlusMinus,
		BINARY_CHECKSUM(ScoreSheetEntryGoalId,
							SeasonId,
							GameId,
							TeamId,
							Line,
							PlusMinus) as BCS
	FROM 
		ScoreSheetEntryProcessedLinePlusMinuses

	IF (@DryRun = 1) 
	BEGIN
		PRINT 'DRY RUN. NOT UPDATING REAL TABLES'


		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		delete from #scoreSheetEntryProcessedPlusMinusesCopy
		from
			#scoreSheetEntryProcessedPlusMinusesCopy c left join
			#scoreSheetEntryProcessedPlusMinusesNew n ON (c.ScoreSheetEntryGoalId = n.ScoreSheetEntryGoalId AND c.TeamId = n.TeamId)
		where
			n.GameId is null and
			c.GameId between @StartingGameId and @EndingGameId

		update #results set ExistingRecordsDeleted = @@ROWCOUNT

		update #scoreSheetEntryProcessedPlusMinusesCopy
		set
		    Line = n.Line,
			PlusMinus = n.PlusMinus,
			GameId = n.GameId,
			SeasonId = n.SeasonId
		from
			#scoreSheetEntryProcessedPlusMinusesCopy c INNER JOIN
			#scoreSheetEntryProcessedPlusMinusesNew n ON (c.ScoreSheetEntryGoalId = n.ScoreSheetEntryGoalId AND c.TeamId = n.TeamId)
		where
		    c.BCS <> n.BCS

		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into #scoreSheetEntryProcessedPlusMinusesCopy
		select
			n.*
		from
			#scoreSheetEntryProcessedPlusMinusesNew n left join
			#scoreSheetEntryProcessedPlusMinusesCopy c ON (c.ScoreSheetEntryGoalId = n.ScoreSheetEntryGoalId AND c.TeamId = n.TeamId)
		where
			c.ScoreSheetEntryGoalId is null

		update #results set NewRecordsInserted = @@ROWCOUNT
	END
	ELSE
	BEGIN
		PRINT 'NOT A DRY RUN. UPDATING REAL TABLES'

		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		delete from ScoreSheetEntryProcessedLinePlusMinuses
		from
			ScoreSheetEntryProcessedLinePlusMinuses c LEFT JOIN
			#scoreSheetEntryProcessedPlusMinusesNew n ON (c.ScoreSheetEntryGoalId = n.ScoreSheetEntryGoalId AND c.TeamId = n.TeamId)
		where
			n.GameId is null and
			c.GameId between @StartingGameId and @EndingGameId

		update #results set ExistingRecordsDeleted = @@ROWCOUNT

		update ScoreSheetEntryProcessedLinePlusMinuses
		set
		    Line = n.Line,
			PlusMinus = n.PlusMinus,
			GameId = n.GameId,
			SeasonId = n.SeasonId
		from
			ScoreSheetEntryProcessedLinePlusMinuses r INNER JOIN
			#scoreSheetEntryProcessedPlusMinusesCopy c ON (r.ScoreSheetEntryGoalId = c.ScoreSheetEntryGoalId AND r.TeamId = c.TeamId) INNER JOIN
			#scoreSheetEntryProcessedPlusMinusesNew n ON (c.ScoreSheetEntryGoalId = n.ScoreSheetEntryGoalId AND c.TeamId = n.TeamId)
		where
		    c.BCS <> n.BCS


		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into ScoreSheetEntryProcessedLinePlusMinuses(ScoreSheetEntryGoalId,
		    SeasonId,
			GameId,
			TeamId,
			Line,
			PlusMinus)
		select
			n.ScoreSheetEntryGoalId,
			n.SeasonId,
			n.GameId,
			n.TeamId,
			n.Line,
			n.PlusMinus
		from
			#scoreSheetEntryProcessedPlusMinusesNew n left join
			ScoreSheetEntryProcessedLinePlusMinuses c ON (c.ScoreSheetEntryGoalId = n.ScoreSheetEntryGoalId AND c.TeamId = n.TeamId)
		where
			c.ScoreSheetEntryGoalId is null
		order by
			n.ScoreSheetEntryGoalId,
			n.TeamId

		update #results set NewRecordsInserted = @@ROWCOUNT
	END

	update #results set ProcessedRecordsMatchExistingRecords = (select count(*) from #scoreSheetEntryProcessedPlusMinusesNew) - NewRecordsInserted - ExistingRecordsUpdated

	select * from #results
	 
END TRY
BEGIN CATCH
    THROW;
END CATCH;

/*

select
	s.TeamId,
	t.TeamNameLong,
	s.Line,
	sum(s.PlusMinus)
from
	ScoreSheetEntryProcessedLinePlusMinuses s inner join
	Teams t on (s.TeamId = t.TeamId)
group by
	s.TeamId,
	t.TeamNameLong,
	s.Line
order by
		s.TeamId,
	t.TeamNameLong,
	s.Line

	*/