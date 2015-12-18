CREATE VIEW [dbo].[BoxScoresSummaryView] AS
SELECT
	g.GameId,
	g.GameDateTime,
	gt.GameTeamId,
	st.SeasonTeamId,
	t.TeamId,
	t.TeamShortName,
	t.TeamLongName,
	gt.HomeTeam,
	o.Outcome,
	gs1.Score as Period1,
	gs2.Score as Period2,
	gs3.Score as Period3,
	gs4.Score as Period4,
	o.GoalsFor as Final
FROM
	Games g INNER JOIN
	GameTeams gt ON (g.GameId = gt.GameId) INNER JOIN
	SeasonTeams st ON (gt.SeasonTeamId = st.SeasonTeamId) INNER JOIN
	Teams t ON (st.TeamId = t.TeamId) LEFT JOIN
	GameOutcomes o ON (gt.GameTeamId = o.GameTeamId) LEFT JOIN
	GameScores gs1 ON (gt.GameTeamId = gs1.GameTeamId AND gs1.Period = 1) LEFT JOIN
	GameScores gs2 ON (gt.GameTeamId = gs2.GameTeamId AND gs2.Period = 2) LEFT JOIN	
	GameScores gs3 ON (gt.GameTeamId = gs3.GameTeamId AND gs3.Period = 3) LEFT JOIN
	GameScores gs4 ON (gt.GameTeamId = gs4.GameTeamId AND gs4.Period = 4)

