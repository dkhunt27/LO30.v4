using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

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

    #region foreign keys
    // items in the classes below must exist before an item in this class

    public virtual Season Season { get; set; }

    public virtual Player Coach { get; set; }

    public virtual Player Sponsor { get; set; }

    public virtual Division Division { get; set; }
    #endregion

    #region foreign keys referenced in another class
    // items in this class must exist before items in the classes below

    public virtual List<GameOutcome> GameOutcomes { get; set; }

    public virtual List<GameOutcome> GameOutcomesOpponent { get; set; }

    public virtual List<GameOutcomeOverride> GameOutcomeOverrides { get; set; }

    public virtual List<GameRoster> GameRosters { get; set; }

    public virtual List<GameScore> GameScores { get; set; }

    public virtual List<GameTeam> GameTeams { get; set; }

    public virtual List<GameTeam> GameTeamOpponents { get; set; }

    public virtual List<GoalieStatTeam> GoalieStatTeams { get; set; }

    public virtual List<GoalieStatGame> GoalieStatGames { get; set; }

    public virtual List<PlayerStatTeam> PlayerStatTeams { get; set; }

    public virtual List<PlayerStatGame> PlayerStatGames { get; set; }
    #endregion
  }
}