using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LO30.Web.Models.Objects
{
  public class Player
  {
    [Required]
    public int PlayerId { get; set; }

    [Required, MaxLength(35)]
    public string FirstName { get; set; }

    [Required, MaxLength(35)]
    public string LastName { get; set; }

    [MaxLength(5)]
    public string Suffix { get; set; }

    [Required, MaxLength(1)]
    public string PreferredPosition { get; set; }

    [Required, MaxLength(1)]
    public string Shoots { get; set; }

    public DateTime? BirthDate { get; set; }

    public string Profession { get; set; }

    public string WifesName { get; set; }

    #region foreign keys referenced in another class
    // items in this class must exist before items in the classes below

    public virtual List<GameRoster> GameRosters { get; set; }

    public virtual List<GameRoster> GameRostersSubbedFor { get; set; }

    public virtual GoalieStatCareer GoalieStatCareer { get; set; }

    public virtual List<GoalieStatSeason> GoalieStatSeasons { get; set; }

    public virtual List<GoalieStatTeam> GoalieStatTeams { get; set; }

    public virtual List<GoalieStatGame> GoalieStatGames { get; set; }

    public virtual PlayerStatCareer PlayerStatCareer { get; set; }

    public virtual List<PlayerStatSeason> PlayerStatSeasons { get; set; }

    public virtual List<PlayerStatTeam> PlayerStatTeams { get; set; }

    public virtual List<PlayerStatGame> PlayerStatGames { get; set; }

    public virtual List<PlayerStatus> PlayerStatuses { get; set; }

    public virtual List<Team> CoachedTeams { get; set; }

    public virtual List<Team> SponsoredTeams { get; set; }
    #endregion
  }
}