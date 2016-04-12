CREATE VIEW [dbo].[GoalieStatGamesView] AS
select 
	gsg.PlayerId,
	gsg.GameId,
	gsg.TeamId,
	gsg.Playoffs,
	gsg.SeasonId,
	gsg.Sub,
	gsg.GoalsAgainst,
	gsg.Shutouts,
	gsg.Wins,
	'' as XX,
	p.FirstName,
	p.LastName,
	s.SeasonName,
	s.IsCurrentSeason,
	s.StartYYYYMMDD,
	s.EndYYYYMMDD,
	t.TeamCode,
	t.TeamNameShort,
	t.TeamNameLong,
	g.GameDateTime,
	g.GameYYYYMMDD
from
	GoalieStatGames gsg INNER JOIN 
	Players p on (gsg.PlayerId = p.PlayerId) INNER JOIN 
	Seasons s on (gsg.SeasonId = s.SeasonId) INNER JOIN 
	Teams t on (gsg.TeamId = t.TeamId) INNER JOIN
	Games g on (gsg.GameId = g.GameId)
