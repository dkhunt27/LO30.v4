
--DROP PROCEDURE [dbo].[DeriveScoreSheetEntryProcessedGoals]

CREATE PROCEDURE dbo.DeriveScoreSheetEntryProcessedGoals
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
	IF OBJECT_ID('tempdb..#scoreSheetEntryProcessedGoalsCopy') IS NOT NULL DROP TABLE #scoreSheetEntryProcessedGoalsCopy
	IF OBJECT_ID('tempdb..#scoreSheetEntryProcessedGoalsNew') IS NOT NULL DROP TABLE #scoreSheetEntryProcessedGoalsNew

	CREATE TABLE #results (
		TableName nvarchar(35) NOT NULL,
		NewRecordsInserted int NOT NULL,
		ExistingRecordsUpdated int NOT NULL,
		ExistingRecordsDeleted int NOT NULL,
		ProcessedRecordsMatchExistingRecords int NOT NULL
	)

	CREATE TABLE #scoreSheetEntryProcessedGoalsCopy (
		[ScoreSheetEntryGoalId] [int] NOT NULL,
		[SeasonId] [int] NOT NULL,
		[TeamId] [int] NOT NULL,
		[GameId] [int] NOT NULL,
		[Period] [int] NOT NULL,
		[HomeTeam] [bit] NOT NULL,
		[GoalPlayerId] [int] NOT NULL,
		[Assist1PlayerId] [int] NULL,
		[Assist2PlayerId] [int] NULL,
		[Assist3PlayerId] [int] NULL,
		[TimeRemaining] [nvarchar](5) NOT NULL,
		[TimeElapsed] [time](7) NOT NULL,
		[ShortHandedGoal] [bit] NOT NULL,
		[PowerPlayGoal] [bit] NOT NULL,
		[GameWinningGoal] [bit] NOT NULL,
		[BCS] [int] NULL
	)
	CREATE UNIQUE INDEX PK ON #scoreSheetEntryProcessedGoalsCopy([ScoreSheetEntryGoalId])

	CREATE TABLE #scoreSheetEntryProcessedGoalsNew (
		[ScoreSheetEntryGoalId] [int] NOT NULL,
		[SeasonId] [int] NOT NULL,
		[TeamId] [int] NOT NULL,
		[GameId] [int] NOT NULL,
		[Period] [int] NOT NULL,
		[HomeTeam] [bit] NOT NULL,
		[GoalPlayerId] [int] NOT NULL,
		[Assist1PlayerId] [int] NULL,
		[Assist2PlayerId] [int] NULL,
		[Assist3PlayerId] [int] NULL,
		[TimeRemaining] [nvarchar](5) NOT NULL,
		[TimeElapsed] [time](7) NULL,
		[ShortHandedGoal] [bit] NOT NULL,
		[PowerPlayGoal] [bit] NOT NULL,
		[GameWinningGoal] [bit] NOT NULL,
		[BCS] [int] NULL
	)
	CREATE UNIQUE INDEX PK ON #scoreSheetEntryProcessedGoalsNew([ScoreSheetEntryGoalId])

	INSERT INTO #results
	SELECT
		'ScoreSheetEntryProcessedGoals' as TableName,
		0 as NewRecordsInserted,
		0 as ExistingRecordsUpdated,
		0 as ExistingRecordsDeleted,
		0 as ProcessedRecordsMatchExistingRecords

	-- PROCESS SCORE SHEET ENTRY GOALS
	INSERT INTO #scoreSheetEntryProcessedGoalsNew
	SELECT
		sseg.ScoreSheetEntryGoalId,
		gt.SeasonId,
		gt.TeamId,
		gt.GameId,
		sseg.Period,
		sseg.HomeTeam,
		case when grg.PlayerId is null then 0 else grg.PlayerId end,  -- if goal scorer is unknown, set to unknown player
		case when sseg.Assist1 is not null and gra1.PlayerId is null then 0 else gra1.PlayerId end,  -- if there is an assist and the assister is unknown, set to unknown player
		case when sseg.Assist2 is not null and gra2.PlayerId is null then 0 else gra2.PlayerId end,  -- if there is an assist and the assister is unknown, set to unknown player
		case when sseg.Assist3 is not null and gra3.PlayerId is null then 0 else gra3.PlayerId end,  -- if there is an assist and the assister is unknown, set to unknown player
		sseg.TimeRemaining,
		null as TimeElapsed,
		case when sseg.ShortHandedPowerPlay = 'SH' then 1 else 0 end as ShortHandedGoal,
		case when sseg.ShortHandedPowerPlay = 'PP' then 1 else 0 end as PowerPlayGoal,
		0 as GameWinningGoal,
		null as BCS
	FROM
		ScoreSheetEntryGoals sseg inner join
		GameTeams gt on (sseg.GameId = gt.GameId AND sseg.HomeTeam = gt.HomeTeam) left join
		GameRosters grg ON (sseg.GameId = grg.GameId AND gt.TeamId = grg.TeamId AND sseg.Goal = grg.PlayerNumber) left join
		GameRosters gra1 ON (sseg.GameId = gra1.GameId AND gt.TeamId = gra1.TeamId AND sseg.Assist1 = gra1.PlayerNumber) left join
		GameRosters gra2 ON (sseg.GameId = gra2.GameId AND gt.TeamId = gra2.TeamId AND sseg.Assist2 = gra2.PlayerNumber) left join
		GameRosters gra3 ON (sseg.GameId = gra3.GameId AND gt.TeamId = gra3.TeamId AND sseg.Assist3 = gra3.PlayerNumber)
	WHERE
		sseg.GameId between @StartingGameId and @EndingGameId

	update #scoreSheetEntryProcessedGoalsNew
	set TimeRemaining = replace(timeremaining, '.', ':')

	update #scoreSheetEntryProcessedGoalsNew
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
		#scoreSheetEntryProcessedGoalsNew

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

	update #scoreSheetEntryProcessedGoalsNew
	set
		TimeElapsed = TIMEFROMPARTS(0,
									(period-1)*@TimePerPeriod + 
									case when substring(timeremaining, PATINDEX('%:%',timeremaining)+1, LEN(timeremaining)) = 0 then (@TimePerPeriod-substring(timeremaining,0, PATINDEX('%:%',timeremaining))) else (@TimePerPeriod-substring(timeremaining,0, PATINDEX('%:%',timeremaining))-1) end
									, 
									
									case when substring(timeremaining, PATINDEX('%:%',timeremaining)+1, LEN(timeremaining)) = 0 then 0 else 60 - substring(timeremaining, PATINDEX('%:%',timeremaining)+1, LEN(timeremaining)) end
									,
									
									0, 0)

	
	update #scoreSheetEntryProcessedGoalsNew
	set
		BCS = BINARY_CHECKSUM(ScoreSheetEntryGoalId,
					SeasonId,
					TeamId,
					GameId,
					Period,
					HomeTeam,
					GoalPlayerId,
					Assist1PlayerId,
					Assist2PlayerId,
					Assist3PlayerId,
					TimeRemaining,
					TimeElapsed,
					ShortHandedGoal,
					PowerPlayGoal,
					GameWinningGoal)


	INSERT INTO #scoreSheetEntryProcessedGoalsCopy
	SELECT 
		ScoreSheetEntryGoalId,
		SeasonId,
		TeamId,
		GameId,
		Period,
		HomeTeam,
		GoalPlayerId,
		Assist1PlayerId,
		Assist2PlayerId,
		Assist3PlayerId,
		TimeRemaining,
		TimeElapsed,
		ShortHandedGoal,
		PowerPlayGoal,
		GameWinningGoal,
		BINARY_CHECKSUM(ScoreSheetEntryGoalId,
							SeasonId,
							TeamId,
							GameId,
							Period,
							HomeTeam,
							GoalPlayerId,
							Assist1PlayerId,
							Assist2PlayerId,
							Assist3PlayerId,
							TimeRemaining,
							TimeElapsed,
							ShortHandedGoal,
							PowerPlayGoal,
							GameWinningGoal) as BCS
	FROM 
		ScoreSheetEntryProcessedGoals

	IF (@DryRun = 1) 
	BEGIN
		PRINT 'DRY RUN. NOT UPDATING REAL TABLES'


     /* Audit records change
			select * from #scoreSheetEntryProcessedGoalsCopy where ScoreSheetEntryGoalId = 3372
			select * from #scoreSheetEntryProcessedGoalsNew where ScoreSheetEntryGoalId = 3372
		*/

		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		delete from #scoreSheetEntryProcessedGoalsCopy
		from
			#scoreSheetEntryProcessedGoalsCopy c left join
			#scoreSheetEntryProcessedGoalsNew n on (c.ScoreSheetEntryGoalId = n.ScoreSheetEntryGoalId)
		where
			n.GameId is null and
			c.GameId between @StartingGameId and @EndingGameId

		update #results set ExistingRecordsDeleted = @@ROWCOUNT

		update #scoreSheetEntryProcessedGoalsCopy
		set
			SeasonId = n.SeasonId,
			TeamId = n.TeamId,
			GameId = n.GameId,
			Period = n.Period,
			HomeTeam = n.HomeTeam,
			GoalPlayerId = n.GoalPlayerId,
			Assist1PlayerId = n.Assist1PlayerId,
			Assist2PlayerId = n.Assist2PlayerId,
			Assist3PlayerId = n.Assist3PlayerId,
			TimeRemaining = n.TimeRemaining,
			TimeElapsed = n.TimeElapsed,
			ShortHandedGoal = n.ShortHandedGoal,
			PowerPlayGoal = n.PowerPlayGoal,
			GameWinningGoal = n.GameWinningGoal
		from
			#scoreSheetEntryProcessedGoalsCopy c INNER JOIN
			#scoreSheetEntryProcessedGoalsNew n ON (c.ScoreSheetEntryGoalId = n.ScoreSheetEntryGoalId)
		where
		    c.BCS <> n.BCS

		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into #scoreSheetEntryProcessedGoalsCopy
		select
			n.*
		from
			#scoreSheetEntryProcessedGoalsNew n left join
			#scoreSheetEntryProcessedGoalsCopy c ON (c.ScoreSheetEntryGoalId = n.ScoreSheetEntryGoalId)
		where
			c.GameId is null

		update #results set NewRecordsInserted = @@ROWCOUNT
	END
	ELSE
	BEGIN
		PRINT 'NOT A DRY RUN. UPDATING REAL TABLES'

		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		delete from ScoreSheetEntryProcessedGoals
		from
			ScoreSheetEntryProcessedGoals c LEFT JOIN
			#scoreSheetEntryProcessedGoalsNew n ON (c.ScoreSheetEntryGoalId = n.ScoreSheetEntryGoalId)
		where
			n.GameId is null and
			c.GameId between @StartingGameId and @EndingGameId

		update #results set ExistingRecordsDeleted = @@ROWCOUNT

		update ScoreSheetEntryProcessedGoals
		set
			SeasonId = n.SeasonId,
			TeamId = n.TeamId,
			GameId = n.GameId,
			Period = n.Period,
			HomeTeam = n.HomeTeam,
			GoalPlayerId = n.GoalPlayerId,
			Assist1PlayerId = n.Assist1PlayerId,
			Assist2PlayerId = n.Assist2PlayerId,
			Assist3PlayerId = n.Assist3PlayerId,
			TimeRemaining = n.TimeRemaining,
			TimeElapsed = n.TimeElapsed,
			ShortHandedGoal = n.ShortHandedGoal,
			PowerPlayGoal = n.PowerPlayGoal,
			GameWinningGoal = n.GameWinningGoal
		from
			ScoreSheetEntryProcessedGoals r INNER JOIN
			#scoreSheetEntryProcessedGoalsCopy c ON (r.ScoreSheetEntryGoalId = c.ScoreSheetEntryGoalId) INNER JOIN
			#scoreSheetEntryProcessedGoalsNew n ON (c.ScoreSheetEntryGoalId = n.ScoreSheetEntryGoalId)
		where
		    c.BCS <> n.BCS


		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		SET IDENTITY_INSERT ScoreSheetEntryProcessedGoals ON

		insert into ScoreSheetEntryProcessedGoals(ScoreSheetEntryGoalId,
			SeasonId,
			TeamId,
			GameId,
			Period,
			HomeTeam,
			GoalPlayerId,
			Assist1PlayerId,
			Assist2PlayerId,
			Assist3PlayerId,
			TimeRemaining,
			TimeElapsed,
			ShortHandedGoal,
			PowerPlayGoal,
			GameWinningGoal)
		select
			n.ScoreSheetEntryGoalId,
			n.SeasonId,
			n.TeamId,
			n.GameId,
			n.Period,
			n.HomeTeam,
			n.GoalPlayerId,
			n.Assist1PlayerId,
			n.Assist2PlayerId,
			n.Assist3PlayerId,
			n.TimeRemaining,
			n.TimeElapsed,
			n.ShortHandedGoal,
			n.PowerPlayGoal,
			n.GameWinningGoal
		from
			#scoreSheetEntryProcessedGoalsNew n left join
			ScoreSheetEntryProcessedGoals c ON (c.ScoreSheetEntryGoalId = n.ScoreSheetEntryGoalId)
		where
			c.GameId is null
    order by
		  n.GameId,
			n.Period,
			n.TimeElapsed

		update #results set NewRecordsInserted = @@ROWCOUNT

		SET IDENTITY_INSERT ScoreSheetEntryProcessedGoals OFF
	END

	update #results set ProcessedRecordsMatchExistingRecords = (select count(*) from #scoreSheetEntryProcessedGoalsNew) - NewRecordsInserted - ExistingRecordsUpdated

	select * from #results
	 
END TRY
BEGIN CATCH
    THROW;
END CATCH;
