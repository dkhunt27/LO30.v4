
--DROP PROCEDURE [dbo].[DeriveForWebPlayerStats]

CREATE PROCEDURE dbo.DeriveForWebPlayerStats
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

	SET @StartingSeasonId = 54;
	SET @EndingSeasonId = 54;

	SET @DryRun = 0;
-- STOP comment this out when saving as stored proc
*/

	IF OBJECT_ID('tempdb..#results') IS NOT NULL DROP TABLE #results
	IF OBJECT_ID('tempdb..#forWebPlayerStatsCopy') IS NOT NULL DROP TABLE #forWebPlayerStatsCopy
	IF OBJECT_ID('tempdb..#forWebPlayerStatsNew') IS NOT NULL DROP TABLE #forWebPlayerStatsNew

	CREATE TABLE #results (
		TableName nvarchar(35) NOT NULL,
		NewRecordsInserted int NOT NULL,
		ExistingRecordsUpdated int NOT NULL,
		ExistingRecordsDeleted int NOT NULL,
		ProcessedRecordsMatchExistingRecords int NOT NULL
	)

	CREATE TABLE #forWebPlayerStatsNew (
		SID int NOT NULL,
		TID int NOT NULL,
		PID int NOT NULL,
		PFS bit NOT NULL,
		Sub nvarchar(1) NOT NULL,
		Player nvarchar(50) NOT NULL,
		Team nvarchar(35) NOT NULL,
		Line int NOT NULL,
		Pos nvarchar(1) NOT NULL,
		GP int NOT NULL,
		G int NOT NULL,
		A int NOT NULL,
		P int NOT NULL,
		PIM int NOT NULL,
		PPG int NOT NULL,
		SHG int NOT NULL,
		GWG int NOT NULL,
		BCS int NULL
	)
	CREATE UNIQUE INDEX PK ON #forWebPlayerStatsNew(SID, TID, PID, PFS, Sub)

	CREATE TABLE #forWebPlayerStatsCopy (
		SID int NOT NULL,
		TID int NOT NULL,
		PID int NOT NULL,
		PFS bit NOT NULL,
		Sub nvarchar(1) NOT NULL,
		Player nvarchar(50) NOT NULL,
		Team nvarchar(35) NOT NULL,
		Line int NOT NULL,
		Pos nvarchar(1) NOT NULL,
		GP int NOT NULL,
		G int NOT NULL,
		A int NOT NULL,
		P int NOT NULL,
		PIM int NOT NULL,
		PPG int NOT NULL,
		SHG int NOT NULL,
		GWG int NOT NULL,
		BCS int NULL
	)
	CREATE UNIQUE INDEX PK ON #forWebPlayerStatsCopy(SID, TID, PID, PFS, Sub)

	INSERT INTO #results
	SELECT
		'ForWebPlayerStats' as TableName,
		0 as NewRecordsInserted,
		0 as ExistingRecordsUpdated,
		0 as ExistingRecordsDeleted,
		0 as ProcessedRecordsMatchExistingRecords


	insert into #forWebPlayerStatsNew
	select
		s.SeasonId,
		s.TeamId,
		s.PlayerId,
		s.Playoffs,
		case when s.Sub = 1 then 'Y' else 'N' end,
		case when p.Suffix is null then p.FirstName + ' ' + p.LastName else p.FirstName + ' ' + p.LastName + ' ' + p.Suffix end,
		t.TeamNameLong,
		s.Line,
		s.Position,
		s.Games,
		s.Goals,
		s.Assists,
		s.Points,
		s.PenaltyMinutes,
		s.PowerPlayGoals,
		s.ShortHandedGoals,
		s.GameWinningGoals,
		NULL as BCS
	from
		PlayerStatTeams s INNER JOIN
		Players p on (s.PlayerId = p.PlayerId) INNER JOIN
		Teams t on (s.TeamId = t.TeamId)
	where
		s.SeasonId between @StartingSeasonId and @EndingSeasonId AND
		s.PlayerId <> 0


	update #forWebPlayerStatsNew
	set
		BCS = BINARY_CHECKSUM(SID,
								TID,
								PID,
								PFS,
								Sub,
								Player,
								Team,
								Line,
								Pos,
								GP,
								G,
								A,
								P,
								PIM,
								PPG,
								SHG,
								GWG)

	INSERT INTO #forWebPlayerStatsCopy
	SELECT 
		SID,
		TID,
		PID,
		PFS,
		Sub,
		Player,
		Team,
		Line,
		Pos,
		GP,
		G,
		A,
		P,
		PIM,
		PPG,
		SHG,
		GWG,
		BINARY_CHECKSUM(SID,
								TID,
								PID,
								PFS,
								Sub,
								Player,
								Team,
								Line,
								Pos,
								GP,
								G,
								A,
								P,
								PIM,
								PPG,
								SHG,
								GWG) as BCS
	FROM 
		ForWebPlayerStats


	/* Audit data
	  select * from #forWebPlayerStatsCopy where pid = 593
	  select * from #forWebPlayerStatsNew where pid = 593
	*/

	IF (@dryrun = 1) 
	BEGIN
		-- this is not a dry run
		PRINT 'DRY RUN. NOT UPDATING REAL TABLES'

		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		delete from #forWebPlayerStatsCopy
		from
			#forWebPlayerStatsCopy c left join
			#forWebPlayerStatsNew n on (c.SID = n.SID AND c.TID = n.TID AND c.PID = n.PID AND c.PFS = n.PFS AND c.Sub = n.Sub)
		where
			n.SID is null and
			c.SID between @StartingSeasonId and @EndingSeasonId

		update #results set ExistingRecordsDeleted = @@ROWCOUNT

		update #forWebPlayerStatsCopy
		set
			Player = n.Player,
			Team = n.Team,
			Line = n.Line,
			Pos = n.Pos,
			GP = n.GP,
			G = n.G,
			A = n.A,
			P = n.P,
			PIM = n.PIM,
			PPG = n.PPG,
			SHG = n.SHG,
			GWG = n.GWG
			--select *
		from
			#forWebPlayerStatsCopy c INNER JOIN
			#forWebPlayerStatsNew n ON (c.SID = n.SID AND c.TID = n.TID AND c.PID = n.PID AND c.PFS = n.PFS AND c.Sub = n.Sub)
		where
		/*c.pid = 593 and
					c.Player = n.Player and
			c.Team = n.Team and
			c.Line = n.Line and
			c.Pos = n.Pos and
			c.GP = n.GP and
			c.G = n.G and
			c.A = n.A and
			c.P = n.P and
			c.PIM = n.PIM and
			c.PPG = n.PPG and
			c.SHG = n.SHG and
			c.GWG = n.GWG*/

			c.BCS <> n.BCS

		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into #forWebPlayerStatsCopy
		select
			n.*
		from
			#forWebPlayerStatsNew n left join
			#forWebPlayerStatsCopy c on (c.SID = n.SID AND c.TID = n.TID AND c.PID = n.PID AND c.PFS = n.PFS AND c.Sub = n.Sub)
		where
			c.PID is null

		update #results set NewRecordsInserted = @@ROWCOUNT
	END
	ELSE
	BEGIN
		-- this is not a dry run
		PRINT 'NOT A DRY RUN. UPDATING REAL TABLES'

		-- NEED TO DELETE ANY RECORDS THAT MIGHT HAVE ALREADY PROCESSED, BUT ARE NO LONGER VALID
		delete from ForWebPlayerStats
		from
			ForWebPlayerStats c left join
			#forWebPlayerStatsNew n on (c.SID = n.SID AND c.TID = n.TID AND c.PID = n.PID AND c.PFS = n.PFS AND c.Sub = n.Sub)
		where
			n.SID is null and
			c.SID between @StartingSeasonId and @EndingSeasonId

		update #results set ExistingRecordsDeleted = @@ROWCOUNT

		update ForWebPlayerStats
		set
			Player = n.Player,
			Team = n.Team,
			Line = n.Line,
			Pos = n.Pos,
			GP = n.GP,
			G = n.G,
			A = n.A,
			P = n.P,
			PIM = n.PIM,
			PPG = n.PPG,
			SHG = n.SHG,
			GWG = n.GWG
		from
			ForWebPlayerStats r INNER JOIN
			#forWebPlayerStatsCopy c ON (r.SID = c.SID AND r.TID = c.TID AND r.PID = c.PID AND r.PFS = c.PFS AND r.Sub = c.Sub) INNER JOIN
			#forWebPlayerStatsNew n ON (c.SID = n.SID AND c.TID = n.TID AND c.PID = n.PID AND c.PFS = n.PFS AND c.Sub = n.Sub)
		where
			c.BCS <> n.BCS

		update #results set ExistingRecordsUpdated = @@ROWCOUNT

		insert into ForWebPlayerStats
		select
			n.SID,
			n.TID,
			n.PID,
			n.PFS,
			n.Sub,
			n.Player,
			n.Team,
			n.Line,
			n.Pos,
			n.GP,
			n.G,
			n.A,
			n.P,
			n.PIM,
			n.PPG,
			n.SHG,
			n.GWG
		from
			#forWebPlayerStatsNew n left join
			ForWebPlayerStats c on (c.SID = n.SID AND c.TID = n.TID AND c.PID = n.PID AND c.PFS = n.PFS AND c.Sub = n.Sub)
		where
			c.PID is null

		update #results set NewRecordsInserted = @@ROWCOUNT

	END

	update #results set ProcessedRecordsMatchExistingRecords = (select count(*) from #forWebPlayerStatsNew) - NewRecordsInserted - ExistingRecordsUpdated

	select * from #results
END TRY
BEGIN CATCH
    THROW;
END CATCH;
