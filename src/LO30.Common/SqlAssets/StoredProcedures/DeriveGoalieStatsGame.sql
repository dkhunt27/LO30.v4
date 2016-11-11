
--DROP PROCEDURE [dbo].[DeriveGoalieStatsGame]

CREATE PROCEDURE dbo.DeriveGoalieStatsGame
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
	IF OBJECT_ID('tempdb..#statsDetail') IS NOT NULL DROP TABLE #statsDetail
	IF OBJECT_ID('tempdb..#goalieStatGamesCopy') IS NOT NULL DROP TABLE #goalieStatGamesCopy
	IF OBJECT_ID('tempdb..#goalieStatGamesNew') IS NOT NULL DROP TABLE #goalieStatGamesNew

	CREATE TABLE #results (
		TableName nvarchar(35) NOT NULL,
		NewRecordsInserted int NOT NULL,
		ExistingRecordsUpdated int NOT NULL,
		ExistingRecordsDeleted int NOT NULL,
		ProcessedRecordsMatchExistingRecords int NOT NULL
	)

	CREATE TABLE #statsDetail (
		PlayerId int NOT NULL,
		GameId int NOT NULL,
		TeamId int NOT NULL,
		Playoffs bit NOT NULL,
		SeasonId int NOT NULL,
		Sub bit NOT NULL,
		GoalsAgainst int NOT NULL,
		Shutouts int NOT NULL,
		Wins int NOT NULL
	)

	CREATE TABLE #goalieStatGamesNew (
		PlayerId int NOT NULL,
		GameId int NOT NULL,
		TeamId int NOT NULL,
		Playoffs bit NOT NULL,
		SeasonId int NOT NULL,
		Sub bit NOT NULL,
		GoalsAgainst int NOT NULL,
		Shutouts int NOT NULL,
		Wins int NOT NULL,
		BCS int NULL
	)
	CREATE UNIQUE INDEX PK ON #goalieStatGamesNew(PlayerId, GameId)

	CREATE TABLE #goalieStatGamesCopy (
		PlayerId int NOT NULL,
		GameId int NOT NULL,
		TeamId int NOT NULL,
		Playoffs bit NOT NULL,
		SeasonId int NOT NULL,
		Sub bit NOT NULL,
		GoalsAgainst int NOT NULL,
		Shutouts int NOT NULL,
		Wins int NOT NULL,
		BCS int NULL
	)
	CREATE UNIQUE INDEX PK ON #goalieStatGamesCopy(PlayerId, GameId)

	INSERT INTO #results
	SELECT
		'GoalieStatGames' as TableName,
		0 as NewRecordsInserted,
		0 as ExistingRecordsUpdated,
		0 as ExistingRecordsDeleted,
		0 as ProcessedRecordsMatchExistingRecords


	insert into #goalieStatGamesNew
	select
		gr.PlayerId,
		gr.GameId,
		gr.TeamId,
		g.Playoffs,
		gr.SeasonId,
		gr.Sub,
		gout.GoalsAgainst,
		case when gout.GoalsAgainst = 0 then 1 else 0 end as Shutouts,
		case when gout.Outcome = 'W' then 1 else 0 end  as Wins,
		NULL as BCS
	from
		GameRosters gr inner join
		Games g on (gr.GameId = g.GameId) inner join
		GameOutcomes gout on (gr.GameId = gout.GameId AND gr.TeamId = gout.TeamId)
	where
		gr.GameId between @StartingGameId and @EndingGameId AND
		gr.Goalie = 1 AND
		gr.PlayerId > 0

	update #goalieStatGamesNew
	set
		BCS = BINARY_CHECKSUM(PlayerId,
								GameId,
								TeamId,
								Playoffs,
								SeasonId,
								Sub,
								GoalsAgainst,
								Shutouts,
								Wins)


	INSERT INTO #goalieStatGamesCopy
	SELECT 
		PlayerId,
		GameId,
		TeamId,
		Playoffs,
		SeasonId,
		Sub,
		GoalsAgainst,
		Shutouts,
		Wins,
		BINARY_CHECKSUM(PlayerId,
								GameId,
								TeamId,
								Playoffs,
								SeasonId,
								Sub,
								GoalsAgainst,
								Shutouts,
								Wins) as BCS
	FROM 
		GoalieStatGames


	IF (@dryrun = 1) 
	BEGIN
		-- this is not a dry run
		PRINT 'DRY RUN. NOT UPDATING REAL TABLES'
		
		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		delete from #goalieStatGamesCopy
		from
			#goalieStatGamesCopy c left join
			#goalieStatGamesNew n on (c.PlayerId = n.PlayerId AND c.GameId = n.GameId)
		where
			n.GameId is null and
			c.GameId between @StartingGameId and @EndingGameId

		update #results set ExistingRecordsDeleted = @@ROWCOUNT

		update #goalieStatGamesCopy
		set
			TeamId = n.TeamId,
			Playoffs = n.Playoffs,
			SeasonId = n.SeasonId,
			Sub = n.Sub,
			GoalsAgainst = n.GoalsAgainst,
			Shutouts = n.Shutouts,
			Wins = n.Wins
		from
			#goalieStatGamesCopy c INNER JOIN
			#goalieStatGamesNew n ON (c.PlayerId = n.PlayerId AND c.GameId = n.GameId)
		where
			c.BCS <> n.BCS

		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into #goalieStatGamesCopy
		select
			n.*
		from
			#goalieStatGamesNew n left join
			#goalieStatGamesCopy c on (c.PlayerId = n.PlayerId AND c.GameId = n.GameId)
		where
			c.PlayerId is null

		update #results set NewRecordsInserted = @@ROWCOUNT
	END
	ELSE
	BEGIN
		-- this is not a dry run
		PRINT 'NOT A DRY RUN. UPDATING REAL TABLES'

		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		delete from GoalieStatGames
		from
			GoalieStatGames c LEFT JOIN
			#goalieStatGamesNew n ON (c.PlayerId = n.PlayerId AND c.GameId = n.GameId)
		where
			n.GameId is null and
			c.GameId between @StartingGameId and @EndingGameId

		update #results set ExistingRecordsDeleted = @@ROWCOUNT

		update GoalieStatGames
		set
			TeamId = n.TeamId,
			Playoffs = n.Playoffs,
			SeasonId = n.SeasonId,
			Sub = n.Sub,
			GoalsAgainst = n.GoalsAgainst,
			Shutouts = n.Shutouts,
			Wins = n.Wins
		from
			GoalieStatGames r INNER JOIN
			#goalieStatGamesCopy c ON (r.PlayerId = c.PlayerId AND r.GameId = c.GameId) INNER JOIN
			#goalieStatGamesNew n ON (c.PlayerId = n.PlayerId AND c.GameId = n.GameId)
		where
			c.BCS <> n.BCS

		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into GoalieStatGames(PlayerId,
			GameId,
			TeamId,
			Playoffs,
			SeasonId,
			Sub,
			GoalsAgainst,
			Shutouts,
			Wins)
		select
			n.PlayerId,
			n.GameId,
			n.TeamId,
			n.Playoffs,
			n.SeasonId,
			n.Sub,
			n.GoalsAgainst,
			n.Shutouts,
			n.Wins
		from
			#goalieStatGamesNew n left join
			GoalieStatGames c on (c.PlayerId = n.PlayerId AND c.GameId = n.GameId)
		where
			c.PlayerId is null

		update #results set NewRecordsInserted = @@ROWCOUNT

	END

	update #results set ProcessedRecordsMatchExistingRecords = (select count(*) from #goalieStatGamesNew) - NewRecordsInserted - ExistingRecordsUpdated

	select * from #results
END TRY
BEGIN CATCH
    THROW;
END CATCH;
