CREATE VIEW [dbo].[GameRostersView] AS
SELECT
	gr.GameRosterId,
	gr.SeasonId,
	gr.TeamId,
	gr.GameId,
	gr.PlayerId,
	gr.PlayerNumber,
	gr.Position,
	gr.RatingPrimary,
	gr.RatingSecondary,
	gr.Line,
	gr.Goalie,
	gr.Sub,
	gr.SubbingForPlayerId,
	'' as XX,
	t.TeamCode,
	t.TeamNameShort,
	t.TeamNameLong,
	p.FirstName,
	p.LastName,
	ps.FirstName as SubForFirstName,
	ps.LastName as SubForLastName,
	g.GameDateTime,
	g.Playoffs,
	s.SeasonName,
	s.IsCurrentSeason
FROM 
	GameRosters gr
	INNER JOIN Seasons s ON (gr.SeasonId = s.SeasonId)
	INNER JOIN Teams t ON (gr.TeamId = t.TeamId)
	INNER JOIN Games g ON (gr.GameId = g.GameId)
	INNER JOIN Players p ON (gr.PlayerId = p.PlayerId)
	LEFT JOIN Players ps ON (gr.SubbingForPlayerId = ps.PlayerId)


