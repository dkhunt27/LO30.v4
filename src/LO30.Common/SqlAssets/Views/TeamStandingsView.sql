CREATE VIEW [dbo].[TeamStandingsView] AS
SELECT
	ts.TeamId,
	ts.Playoffs,
	ts.SeasonId,
	ts.Ranking,
	ts.Games,
	ts.Wins,
	ts.Losses,
	ts.Ties,
	ts.Points,
	ts.GoalsFor,
	ts.GoalsAgainst,
	ts.PenaltyMinutes,
	ts.Subs,
	'' as XX,
	t.TeamCode,
	t.TeamNameShort,
	t.TeamNameLong,
	d.DivisionShortName,
	d.DivisionLongName,
	s.SeasonName,
	s.IsCurrentSeason,
	s.StartYYYYMMDD,
	s.EndYYYYMMDD
FROM 
	TeamStandings ts
	INNER JOIN Seasons s ON (ts.SeasonId = s.SeasonId)
	INNER JOIN Teams t ON (ts.TeamId = t.TeamId)
	INNER JOIN Divisions d ON (ts.DivisionId = d.DivisionId)


