CREATE VIEW [dbo].[PlayersActiveSubs]
AS
SELECT        
	p.PlayerId, 
	FirstName, 
	LastName, 
	Suffix, 
	PreferredPosition,
	t.TeamNameShort
FROM            
	Players p INNER JOIN
	PlayerStatus ps ON (p.PlayerId = ps.PlayerId AND ps.CurrentStatus = 1) INNER JOIN
	PlayerStatusTypes pst ON (ps.PlayerStatusTypeId = pst.PlayerStatusTypeId) LEFT JOIN
	TeamRosters tr ON (p.PlayerId = tr.PlayerId AND tr.SeasonId = 56) LEFT JOIN
	Teams t ON (tr.TeamId = t.TeamId)
WHERE
	pst.PlayerStatusTypeName in ('League Member','Invited Into League','One Year Sub','Quick Sub')
