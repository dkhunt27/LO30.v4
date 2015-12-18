CREATE VIEW [dbo].[PlayerStatGamesView] AS
select 
	psg.PlayerId,
	psg.GameId,
	psg.TeamId,
	psg.Playoffs,
	psg.SeasonId,
	psg.Sub,
	psg.Line,
	psg.Position,
	psg.Goals,
	psg.Assists,
	psg.Points,
	psg.PenaltyMinutes,
	psg.PowerPlayGoals,
	psg.ShortHandedGoals,
	psg.GameWinningGoals,
	psg.UpdatedOn,
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
	PlayerStatGames psg INNER JOIN 
	Players p on (psg.PlayerId = p.PlayerId) INNER JOIN 
	Seasons s on (psg.SeasonId = s.SeasonId) INNER JOIN 
	Teams t on (psg.TeamId = t.TeamId) INNER JOIN
	Games g on (psg.GameId = g.GameId)
