CREATE VIEW [dbo].[BoxScoresDetailView] AS
SELECT
	g.GameId,
	ssepg.ScoreSheetEntryId,
	ssepg.Period,
	ssepg.TimeRemaining,
	ssepg.GoalPlayerId,
	pg.FirstName as GoalFirstName,
	pg.LastName as GoalLastName,
	pg.Suffix as GoalSuffix,
	ssepg.Assist1PlayerId,
	pa1.FirstName as Assist1FirstName,
	pa1.LastName as Assist1LastName,
	pa1.Suffix as Assist1Suffix,
	ssepg.Assist2PlayerId,
	pa2.FirstName as Assist2FirstName,
	pa2.LastName as Assist2LastName,
	pa2.Suffix as Assist2Suffix,
	ssepg.Assist3PlayerId,
	pa3.FirstName as Assist3FirstName,
	pa3.LastName as Assist3LastName,
	pa3.Suffix as Assist3Suffix,
	ssepg.GameWinningGoal,
	ssepg.PowerPlayGoal,
	ssepg.ShortHandedGoal
FROM
	Games g LEFT JOIN
	ScoreSheetEntryProcessedGoals ssepg ON (g.GameId = ssepg.GameId) LEFT JOIN
	Players pg ON (ssep.GoalPlayerId = pg.PlayerId) LEFT JOIN
	Players pa1 ON (ssep.Assist1PlayerId = pa1.PlayerId) LEFT JOIN
	Players pa2 ON (ssep.Assist2PlayerId = pa2.PlayerId) LEFT JOIN
	Players pa3 ON (ssep.Assist3PlayerId = pa3.PlayerId) 
