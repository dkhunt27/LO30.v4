CREATE VIEW [dbo].[PlayerStatCareersView] AS
select 
	psc.PlayerId,
	psc.Playoffs,
	psc.Games,
	psc.Goals,
	psc.Assists,
	psc.Points,
	psc.PenaltyMinutes,
	psc.PowerPlayGoals,
	psc.ShortHandedGoals,
	psc.GameWinningGoals,
	psc.UpdatedOn,
	'' as XX,
	p.FirstName,
	p.LastName
from
	PlayerStatCareers psc INNER JOIN 
	Players p on (psc.PlayerId = p.PlayerId) 
