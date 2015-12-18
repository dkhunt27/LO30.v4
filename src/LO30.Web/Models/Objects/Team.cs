
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LO30.Web.Models.Objects
{
  public class Team
  {
    [Required]
    public int TeamId { get; set; }

    [Required]
    public int SeasonId { get; set; }
    
    [Required, MaxLength(5)]
    public string TeamCode { get; set; }

    [Required, MaxLength(15)]
    public string TeamNameShort { get; set; }

    [Required, MaxLength(35)]
    public string TeamNameLong { get; set; }

    [Required]
    public int DivisionId { get; set; }

    public int? CoachId { get; set; }

    public int? SponsorId { get; set; }

    // virtual, foreign keys dependent
    public virtual Season Season { get; set; }
    public virtual Player Coach { get; set; }
    public virtual Player Sponsor { get; set; }
    public virtual Division Division { get; set; }

    // virtual, foreign key principal
    public virtual List<PlayerStatTeam> PlayerStatTeams { get; set; }
    public virtual List<PlayerStatGame> PlayerStatGames { get; set; }
  }
}