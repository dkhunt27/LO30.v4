CREATE VIEW [dbo].[PlayerStatTeamsView] AS
select 
	pst.PlayerId,
	pst.TeamId,
	pst.Playoffs,
	pst.Sub,
	pst.SeasonId,
	pst.Line,
	pst.Position,
	pst.Games,
	pst.Goals,
	pst.Assists,
	pst.Points,
	pst.PenaltyMinutes,
	pst.PowerPlayGoals,
	pst.ShortHandedGoals,
	pst.GameWinningGoals,
	pst.UpdatedOn,
	'' as XX,
	p.FirstName,
	p.LastName,
	s.SeasonName,
	s.IsCurrentSeason,
	s.StartYYYYMMDD,
	s.EndYYYYMMDD,
	t.TeamCode,
	t.TeamNameShort,
	t.TeamNameLong

from
	PlayerStatTeams pst INNER JOIN 
	Players p on (pst.PlayerId = p.PlayerId) INNER JOIN 
	Seasons s on (pst.SeasonId = s.SeasonId) INNER JOIN 
	Teams t on (pst.TeamId = t.TeamId)
