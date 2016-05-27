using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LO30.Web.Models.Objects
{
  public class Game
  {
    [Required]
    public int GameId { get; set; }

    [Required]
    public int SeasonId { get; set; }

    [Required]
    public bool Playoffs { get; set; }

    [Required]
    public DateTime GameDateTime { get; set; }

    [Required]
    public int GameYYYYMMDD { get; set; }

    [Required, MaxLength(15)]
    public string Location { get; set; }

    #region foreign keys
    // items in the classes below must exist before an item in this class

    public virtual Season Season { get; set; }
    #endregion

    #region foreign keys referenced in another class
    // items in this class must exist before items in the classes below

    public virtual List<GameOutcome> GameOutcomes { get; set; }

    public virtual List<GameOutcomeOverride> GameOutcomeOverrides { get; set; }

    public virtual List<GameRoster> GameRosters { get; set; }

    public virtual List<GameScore> GameScores { get; set; }

    public virtual List<GameTeam> GameTeams { get; set; }

    public virtual List<GoalieStatGame> GoalieStatGames { get; set; }

    public virtual List<PlayerStatGame> PlayerStatGames { get; set; }

    public virtual List<ScoreSheetEntryGoal> ScoreSheetEntryGoals { get; set; }

    public virtual List<ScoreSheetEntryPenalty> ScoreSheetEntryPenalties { get; set; }

    public virtual List<ScoreSheetEntryProcessedGame> ScoreSheetEntryProcessedGames { get; set; }

    public virtual List<ScoreSheetEntryProcessedGoal> ScoreSheetEntryProcessedGoals { get; set; }

    public virtual List<ScoreSheetEntryProcessedPenalty> ScoreSheetEntryProcessedPenalties { get; set; }

    public virtual List<ScoreSheetEntryProcessedSub> ScoreSheetEntryProcessedSubs { get; set; }

    public virtual List<ScoreSheetEntrySub> ScoreSheetEntrySubs { get; set; }
    #endregion
  }
}