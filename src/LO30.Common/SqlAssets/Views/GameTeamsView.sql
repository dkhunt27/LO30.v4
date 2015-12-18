CREATE VIEW [dbo].[GameTeamsView] AS
SELECT 
	gt.GameId,
	gt.TeamId,
	gt.HomeTeam,
	gt.OpponentTeamId,
	gt.SeasonId,
	'' as XX,
	g.GameDateTime,
	g.GameYYYYMMDD,
	g.Location,
	g.Playoffs,
	s.SeasonName,
	s.IsCurrentSeason,
	s.StartYYYYMMDD,
	s.EndYYYYMMDD,
	t.TeamCode,
	t.TeamNameLong,
	t.TeamNameShort,
	ot.TeamCode as OpponentTeamCode,
	ot.TeamNameLong as OpponentTeamNameLong,
	ot.TeamNameShort as OpponentTeamNameShort
FROM 
	GameTeams gt
	INNER JOIN Games g on (gt.GameId = g.GameId)
	INNER JOIN Seasons s on (gt.SeasonId = s.SeasonId)
	INNER JOIN Teams t on (gt.TeamId = t.TeamId)
	INNER JOIN Teams ot on (gt.OpponentTeamId = ot.TeamId)



