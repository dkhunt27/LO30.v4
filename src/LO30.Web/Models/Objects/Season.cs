using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LO30.Web.Models.Objects
{
  public class Season
  {
    [Required]
    public int SeasonId { get; set; }

    [Required, MaxLength(12)]
    public string SeasonName { get; set; }

    [Required]
    public bool IsCurrentSeason { get; set; }

    [Required]
    public int StartYYYYMMDD { get; set; }

    [Required]
    public int EndYYYYMMDD { get; set; }

    // virtual, foreign key principal
    public virtual List<Game> Games { get; set; }
    public virtual List<PlayerStatSeason> PlayerStatSeasons { get; set; }
    public virtual List<PlayerStatTeam> PlayerStatTeams { get; set; }
    public virtual List<PlayerStatGame> PlayerStatGames { get; set; }
    public virtual List<Team> Teams { get; set; }
  }
}