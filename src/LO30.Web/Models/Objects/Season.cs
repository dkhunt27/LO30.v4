using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

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

    #region foreign keys referenced in another class
    // items in this class must exist before items in the classes below

    public virtual List<Game> Games { get; set; }

    public virtual List<GameOutcome> GameOutcomes { get; set; }

    public virtual List<GameOutcomeOverride> GameOutcomeOverrides { get; set; }

    public virtual List<GameRoster> GameRosters { get; set; }

    public virtual List<GameScore> GameScores { get; set; }

    public virtual List<GameTeam> GameTeams { get; set; }

    public virtual List<GoalieStatSeason> GoalieStatSeasons { get; set; }

    public virtual List<GoalieStatTeam> GoalieStatTeams { get; set; }

    public virtual List<GoalieStatGame> GoalieStatGames { get; set; }

    public virtual List<PlayerStatSeason> PlayerStatSeasons { get; set; }

    public virtual List<PlayerStatTeam> PlayerStatTeams { get; set; }

    public virtual List<PlayerStatGame> PlayerStatGames { get; set; }

    public virtual List<Team> Teams { get; set; }
    #endregion
  }
}