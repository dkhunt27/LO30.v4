CREATE VIEW [dbo].[PlayerStatSeasonsView] AS
select 
	pss.PlayerId,
	pss.SeasonId,
	pss.Playoffs,
	pss.Sub,
	pss.Games,
	pss.Goals,
	pss.Assists,
	pss.Points,
	pss.PenaltyMinutes,
	pss.PowerPlayGoals,
	pss.ShortHandedGoals,
	pss.GameWinningGoals,
	pss.UpdatedOn,
	'' as XX,
	p.FirstName,
	p.LastName,
	s.SeasonName,
	s.IsCurrentSeason,
	s.StartYYYYMMDD,
	s.EndYYYYMMDD
from
	PlayerStatSeasons pss INNER JOIN 
	Players p on (pss.PlayerId = p.PlayerId) INNER JOIN 
	Seasons s on (pss.SeasonId = s.SeasonId) 
