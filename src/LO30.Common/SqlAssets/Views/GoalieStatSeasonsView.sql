CREATE VIEW [dbo].[GoalieStatSeasonsView] AS
select 
	gss.PlayerId,
	gss.SeasonId,
	gss.Playoffs,
	gss.Sub,
	gss.Games,
	gss.GoalsAgainst,
	gss.Shutouts,
	gss.Wins,
	gss.UpdatedOn,
	'' as XX,
	p.FirstName,
	p.LastName,
	s.SeasonName,
	s.IsCurrentSeason,
	s.StartYYYYMMDD,
	s.EndYYYYMMDD
from
	GoalieStatSeasons gss INNER JOIN 
	Players p on (gss.PlayerId = p.PlayerId) INNER JOIN 
	Seasons s on (gss.SeasonId = s.SeasonId)
