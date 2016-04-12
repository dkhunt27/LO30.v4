CREATE VIEW [dbo].[GoalieStatCareersView] AS
select 
	gsc.PlayerId,
	gsc.Playoffs,
	gsc.GoalsAgainst,
	gsc.Games,
	gsc.Shutouts,
	gsc.Wins,
	'' as XX,
	p.FirstName,
	p.LastName
from
	GoalieStatCareers gsc INNER JOIN 
	Players p on (gsc.PlayerId = p.PlayerId)
