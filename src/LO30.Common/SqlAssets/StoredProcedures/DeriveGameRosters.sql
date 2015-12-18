--DROP PROCEDURE [dbo].[DeriveGameRosters]

CREATE PROCEDURE dbo.DeriveGameRosters
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

	-- SeasonId 54 Playoffs False
	--SET @StartingGameId = 3200;
	--SET @EndingGameId = 3319;

	-- SeasonId 54 Playoffs True
	--SET @StartingGameId = 3324;
	--SET @EndingGameId = 3372;

	-- SeasonId 56 Playoffs False
	SET @StartingGameId = 3402;
	SET @EndingGameId = 3477;

	SET @DryRun = 0;
-- STOP comment this out when saving as stored proc
*/

	IF OBJECT_ID('tempdb..#results') IS NOT NULL DROP TABLE #results
	IF OBJECT_ID('tempdb..#gameRostersCopy') IS NOT NULL DROP TABLE #gameRostersCopy
	IF OBJECT_ID('tempdb..#gameRostersNew') IS NOT NULL DROP TABLE #gameRostersNew

	CREATE TABLE #results (
		TableName nvarchar(35) NOT NULL,
		NewRecordsInserted int NOT NULL,
		ExistingRecordsUpdated int NOT NULL,
		ExistingRecordsDeleted int NOT NULL,
		ProcessedRecordsMatchExistingRecords int NOT NULL
	)

	CREATE TABLE #gameRostersCopy (
		SeasonId int NOT NULL,
		TeamId int NOT NULL,
		GameId int NOT NULL,
		PlayerId int NOT NULL,
		PlayerNumber nvarchar(3) NOT NULL,
		Position nvarchar(1) NOT NULL,
		RatingPrimary int NOT NULL,
		RatingSecondary int NOT NULL,
		Line int NOT NULL,
		Goalie bit NOT NULL,
		Sub bit NOT NULL,
		SubbingForPlayerId int NULL,
		BCS int NULL
	)
	--CREATE UNIQUE INDEX PK2 ON #gameRostersCopy(GameId,TeamId,PlayerNumber)

	CREATE TABLE #gameRostersNew (
		SeasonId int NOT NULL,
		TeamId int NOT NULL,
		GameId int NOT NULL,
		PlayerId int NOT NULL,
		PlayerNumber nvarchar(3) NOT NULL,
		Position nvarchar(1) NOT NULL,
		RatingPrimary int NOT NULL,
		RatingSecondary int NOT NULL,
		Line int NOT NULL,
		Goalie bit NOT NULL,
		Sub bit NOT NULL,
		SubbingForPlayerId int NULL,
		BCS int NULL
	)
	--CREATE UNIQUE INDEX PK2 ON #gameRostersNew(GameId,TeamId,PlayerNumber)

	INSERT INTO #results
	SELECT
		'GameRosters' as TableName,
		0 as NewRecordsInserted,
		0 as ExistingRecordsUpdated,
		0 as ExistingRecordsDeleted,
		0 as ProcessedRecordsMatchExistingRecords

	-- PROCESS REGULAR PLAYERS WHO DID NOT HAVE A SUB
	INSERT INTO #gameRostersNew
	SELECT
	    g.SeasonId,
		gt.TeamId,
		g.GameId,
		tr.PlayerId,
		tr.PlayerNumber,
		tr.Position,
		tr.RatingPrimary,
		tr.RatingSecondary,
		tr.Line,
		Goalie = case when tr.Position = 'G' then 1 else 0 end,
		Sub = 0,
		SubbingForPlayerId = NULL,
		BCS = NULL
	FROM
		Games g inner join
		GameTeams gt on (g.GameId = gt.GameId) inner join
		TeamRosters tr on (gt.TeamId = tr.TeamId AND g.GameYYYYMMDD between tr.StartYYYYMMDD and tr.EndYYYYMMDD) left join
		ScoreSheetEntryProcessedSubs sseps on (g.GameId = sseps.GameId AND gt.HomeTeam = sseps.HomeTeam AND tr.PlayerId = sseps.SubbingForPlayerId)
	WHERE
		g.GameId between @StartingGameId and @EndingGameId AND
		sseps.SubPlayerId is null 

	-- PROCESS JERSEY UPDATES (player forgot jersey)
	INSERT INTO #gameRostersNew
	SELECT
	  g.SeasonId,
		gt.TeamId,
		g.GameId,
		tr.PlayerId,
		PlayerNumber = sseps.JerseyNumber,
		tr.Position,
		tr.RatingPrimary,
		tr.RatingSecondary,
		tr.Line,
		Goalie = case when tr.Position = 'G' then 1 else 0 end,
		Sub = 0,
		SubbingForPlayerId = NULL,
		BCS = NULL
	FROM
		Games g inner join
		GameTeams gt on (g.GameId = gt.GameId) inner join
		TeamRosters tr on (gt.TeamId = tr.TeamId AND g.GameYYYYMMDD between tr.StartYYYYMMDD and tr.EndYYYYMMDD) inner join
		ScoreSheetEntryProcessedSubs sseps on (g.GameId = sseps.GameId AND gt.HomeTeam = sseps.HomeTeam AND tr.PlayerId = sseps.SubbingForPlayerId)
	WHERE
		g.GameId between @StartingGameId and @EndingGameId AND
		sseps.SubPlayerId = sseps.SubbingForPlayerId

	-- PROCESS SUBS
	INSERT INTO #gameRostersNew
	SELECT
	    g.SeasonId,
		gt.TeamId,
		g.GameId,
		PlayerId = sseps.SubPlayerId,
		PlayerNumber = sseps.JerseyNumber,
		tr.Position,
		RatingPrimary = 0,
		RatingSecondary = 0,
		tr.Line,
		Goalie = case when tr.Position = 'G' then 1 else 0 end,
		Sub = 1,
		SubbingForPlayerId = sseps.SubbingForPlayerId,
		BCS = NULL
	FROM
		Games g inner join
		GameTeams gt on (g.GameId = gt.GameId) inner join
		TeamRosters tr on (gt.TeamId = tr.TeamId AND g.GameYYYYMMDD between tr.StartYYYYMMDD and tr.EndYYYYMMDD) inner join
		ScoreSheetEntryProcessedSubs sseps on (g.GameId = sseps.GameId AND gt.HomeTeam = sseps.HomeTeam AND tr.PlayerId = sseps.SubbingForPlayerId)
	WHERE
		g.GameId between @StartingGameId and @EndingGameId AND
		sseps.SubPlayerId <> sseps.SubbingForPlayerId

	-- PROCESS UNKNOWN SUBS
	INSERT INTO #gameRostersNew
	SELECT
	    g.SeasonId,
		gt.TeamId,
		g.GameId,
		PlayerId = sseps.SubPlayerId,
		PlayerNumber = sseps.JerseyNumber,
		'S' as Position,
		RatingPrimary = 0,
		RatingSecondary = 0,
		0 as Line,
		Goalie = 0,
		Sub = 1,
		SubbingForPlayerId = sseps.SubbingForPlayerId,
		BCS = NULL
	FROM
		Games g inner join
		GameTeams gt on (g.GameId = gt.GameId) inner join
		ScoreSheetEntryProcessedSubs sseps on (g.GameId = sseps.GameId AND gt.HomeTeam = sseps.HomeTeam)
	WHERE
		g.GameId between @StartingGameId and @EndingGameId AND
		sseps.SubPlayerId <= 0 AND
		sseps.SubbingForPlayerId <= 0
			
	update #gameRostersNew
	set
		BCS = BINARY_CHECKSUM(SeasonId,
							TeamId,
							GameId,
							PlayerId,
							PlayerNumber,
							Position,
							RatingPrimary,
							RatingSecondary,
							Line,
							Goalie,
							Sub,
							SubbingForPlayerId)

	-- AUDIT Duplicate Jersey Numbers
	INSERT INTO #gameRostersCopy    -- just inserting into this table to remove the output to the screen
  SELECT
		a.*
	FROM
		#gameRostersNew a INNER JOIN
		#gameRostersNew b ON (a.SeasonId = b.SeasonId AND a.TeamId = b.TeamId AND a.GameId = b.GameId AND a.PlayerNumber = b.PlayerNumber)
	WHERE
		a.PlayerId <> b.PlayerId
    ORDER BY
		a.SeasonId,
		a.GameId,
		a.TeamId,
		a.PlayerNumber,
		a.RatingPrimary,
		a.RatingSecondary

	IF (@@ROWCOUNT > 0) 
	BEGIN
		SELECT * FROM #gameRostersCopy
		IF (@@ROWCOUNT > 0) THROW 51000, 'Duplicate Jersey Numbers', 1;
	END

	INSERT INTO #gameRostersCopy
	SELECT 
	    SeasonId,
		TeamId,
		GameId,
		PlayerId,
		PlayerNumber,
		Position,
		RatingPrimary,
		RatingSecondary,
		Line,
		Goalie,
		Sub,
		SubbingForPlayerId,
		BINARY_CHECKSUM(SeasonId,
							TeamId,
							GameId,
							PlayerId,
							PlayerNumber,
							Position,
							RatingPrimary,
							RatingSecondary,
							Line,
							Goalie,
							Sub,
							SubbingForPlayerId) as BCS
	FROM 
		GameRosters

	IF (@DryRun = 1) 
	BEGIN
		PRINT 'DRY RUN. NOT UPDATING REAL TABLES'

        /* Audit records change
			select * from #gameRostersCopy where GameId = 3372 order by SeasonId, GameId, TeamId, PlayerId
			select * from #gameRostersNew where GameId = 3372 order by SeasonId, GameId, TeamId, PlayerId
		*/

		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		delete from #gameRostersCopy
		from
			#gameRostersCopy c left join
			#gameRostersNew n on (c.GameId = n.GameId AND c.TeamId = n.TeamId AND c.PlayerId = n.PlayerId AND c.PlayerNumber = n.PlayerNumber)
		where
			n.GameId is null and
			c.GameId between @StartingGameId and @EndingGameId

		update #results set ExistingRecordsDeleted = @@ROWCOUNT

		update #gameRostersCopy
		set
		    SeasonId = n.SeasonId,
			PlayerId = n.PlayerId,
			Position = n.Position,
			RatingPrimary = n.RatingPrimary,
			RatingSecondary = n.RatingSecondary,
			Line = n.Line,
			Goalie = n.Goalie,
			Sub = n.Sub,
			SubbingForPlayerId = n.SubbingForPlayerId
		from
			#gameRostersCopy c INNER JOIN
			#gameRostersNew n ON (c.GameId = n.GameId AND c.TeamId = n.TeamId AND c.PlayerNumber = n.PlayerNumber)
		where
			c.BCS <> n.BCS

		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into #gameRostersCopy
		select
			n.*
		from
			#gameRostersNew n left join
			#gameRostersCopy c on (c.GameId = n.GameId AND c.TeamId = n.TeamId AND c.PlayerNumber = n.PlayerNumber)
		where
			c.GameId is null

		update #results set NewRecordsInserted = @@ROWCOUNT
	END
	ELSE
	BEGIN
		PRINT 'NOT A DRY RUN. UPDATING REAL TABLES'

		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		delete from GameRosters
		from
			GameRosters c LEFT JOIN
			#gameRostersNew n ON (c.GameId = n.GameId AND c.TeamId = n.TeamId AND c.PlayerNumber = n.PlayerNumber)
		where
			n.GameId is null and
			c.GameId between @StartingGameId and @EndingGameId

		update #results set ExistingRecordsDeleted = @@ROWCOUNT

		update GameRosters
		set
		  SeasonId = n.SeasonId,
			PlayerId = n.PlayerId,
			Position = n.Position,
			RatingPrimary = n.RatingPrimary,
			RatingSecondary = n.RatingSecondary,
			Line = n.Line,
			Goalie = n.Goalie,
			Sub = n.Sub,
			SubbingForPlayerId = n.SubbingForPlayerId
		from
			GameRosters r INNER JOIN
			#gameRostersCopy c ON (r.GameId = c.GameId AND r.TeamId = c.TeamId AND r.PlayerNumber = c.PlayerNumber) INNER JOIN
			#gameRostersNew n ON (c.GameId = n.GameId AND c.TeamId = n.TeamId AND c.PlayerNumber = n.PlayerNumber)

		where
			c.BCS <> n.BCS

		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into GameRosters(GameId,
			TeamId,
			PlayerNumber,
			PlayerId,
			Position,
			RatingPrimary,
			RatingSecondary,
			Line,
			Goalie,
			Sub,
			SubbingForPlayerId,
			SeasonId)
		select
			n.GameId,
			n.TeamId,
			n.PlayerNumber,
			n.PlayerId,
			n.Position,
			n.RatingPrimary,
			n.RatingSecondary,
			n.Line,
			n.Goalie,
			n.Sub,
			n.SubbingForPlayerId,
			n.SeasonId
		from
			#gameRostersNew n left join
			GameRosters c on (c.GameId = n.GameId AND c.TeamId = n.TeamId AND c.PlayerNumber = n.PlayerNumber)
		where
			c.GameId is null
        order by
		    n.GameId,
			n.TeamId,
			n.PlayerNumber

			
		update #results set NewRecordsInserted = @@ROWCOUNT
	END

	update #results set ProcessedRecordsMatchExistingRecords = (select count(*) from #gameRostersNew) - NewRecordsInserted - ExistingRecordsUpdated

	select * from #results
	  
	-- audit if any subs have duplicate jersey numbers with regular players
	/*
	select
		g.GameId,
		gt.GameTeamId,
		PlayerId = ssesp.SubPlayerId,
		PlayerNumber = ssesp.JerseyNumber,
		tr.Position,
		tr.Line,
		SubbingForPlayerId = ssesp.SubbingForPlayerId
	from
		#toProcess tp inner join
		Games g on (g.GameId between tp.StartingGameId and tp.EndingGameId) inner join
		GameTeams gt on (g.GameId = gt.GameId) inner join
		TeamRosters tr on (gt.SeasonTeamId = tr.SeasonTeamId AND g.GameYYYYMMDD between tr.StartYYYYMMDD and tr.EndYYYYMMDD) inner join
		ScoreSheetEntrySubProcesseds ssesp on (g.GameId = ssesp.GameId AND ssesp.HomeTeam = gt.HomeTeam AND ssesp.SubbingForPlayerId = tr.PlayerId)  left join
		GameRosters gr on (gt.GameTeamId = gr.GameTeamId AND ssesp.JerseyNumber = gr.PlayerNumber and gr.SubbingForPlayerId is not null)
	where
		gr.GameRosterId is null

	-- audit every game should have 16 players (unless they played short)
	select
		gt.GameId,
		gr.GameTeamId,
		count(*) as PlayerCount
	from
		GameRosters gr inner join
		GameTeams gt on (gr.GameTeamId = gt.GameTeamId)
	group by
		gt.GameId,
		gr.GameTeamId
	having
		count(*) <> 16
	order by
		gt.GameId,
		gr.GameTeamId
	*/
END TRY
BEGIN CATCH
    THROW;
END CATCH;

