CREATE VIEW [dbo].[TeamRostersView] AS
SELECT
	tr.SeasonId,
	tr.TeamId,
	tr.PlayerId,
	tr.StartYYYYMMDD,
	tr.EndYYYYMMDD,
	tr.Position,
	tr.RatingPrimary,
	tr.RatingSecondary,
	tr.Line,
	tr.PlayerNumber,
	'' as XX,
	t.TeamCode,
	t.TeamNameShort,
	t.TeamNameLong,
	p.FirstName,
	p.LastName,
	s.SeasonName,
	s.IsCurrentSeason
FROM 
	TeamRosters tr
	INNER JOIN Seasons s ON (tr.SeasonId = s.SeasonId)
	INNER JOIN Teams t ON (tr.TeamId = t.TeamId)
	INNER JOIN Players p ON (tr.PlayerId = p.PlayerId)


