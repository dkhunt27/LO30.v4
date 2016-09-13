using System;
using System.ComponentModel.DataAnnotations;

namespace LO30.Data
{
  public class ScoreSheetEntryProcessedGoal
  {
    [Required]
    public int ScoreSheetEntryGoalId { get; set; }

    [Required]
    public int SeasonId { get; set; }

    [Required]
    public int TeamId { get; set; }

    [Required]
    public int GameId { get; set; }

    [Required]
    public int Period { get; set; }

    [Required]
    public bool HomeTeam { get; set; }

    [Required]
    public int GoalPlayerId { get; set; }

    public int? Assist1PlayerId { get; set; }

    public int? Assist2PlayerId { get; set; }

    public int? Assist3PlayerId { get; set; }

    [Required, MaxLength(5)]
    public string TimeRemaining { get; set; }

    public TimeSpan TimeElapsed { get; set; }

    [Required]
    public bool ShortHandedGoal { get; set; }

    [Required]
    public bool PowerPlayGoal { get; set; }

    [Required]
    public bool GameWinningGoal { get; set; }
    
    #region foreign keys
    // items in the classes below must exist before an item in this class

    public virtual Season Season { get; set; }

    public virtual Team Team { get; set; }

    public virtual Game Game { get; set; }

    public virtual Player GoalPlayer { get; set; }

    public virtual Player Assist1Player { get; set; }

    public virtual Player Assist2Player { get; set; }
    
    public virtual Player Assist3Player { get; set; }
    #endregion
  }
}