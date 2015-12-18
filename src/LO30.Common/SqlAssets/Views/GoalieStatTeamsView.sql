CREATE VIEW [dbo].[GoalieStatTeamsView] AS
select 
	gst.PlayerId,
	gst.TeamId,
	gst.Playoffs,
	gst.SeasonId,
	gst.Sub,
	gst.Games,
	gst.GoalsAgainst,
	gst.Shutouts,
	gst.Wins,
	gst.UpdatedOn,
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
	GoalieStatTeams gst INNER JOIN 
	Players p on (gst.PlayerId = p.PlayerId) INNER JOIN 
	Seasons s on (gst.SeasonId = s.SeasonId) INNER JOIN 
	Teams t on (gst.TeamId = t.TeamId) 
