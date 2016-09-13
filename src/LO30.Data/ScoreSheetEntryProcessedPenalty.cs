using System;
using System.ComponentModel.DataAnnotations;

namespace LO30.Data
{
  public class ScoreSheetEntryProcessedPenalty
  {
    [Required]
    public int ScoreSheetEntryPenaltyId { get; set; }

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
    public int PlayerId { get; set; }

    [Required]
    public int PenaltyId { get; set; }

    [Required, MaxLength(5)]
    public string TimeRemaining { get; set; }

    public TimeSpan TimeElapsed { get; set; }

    [Required]
    public int PenaltyMinutes { get; set; }
    
    #region foreign keys
    // items in the classes below must exist before an item in this class

    public virtual Season Season { get; set; }

    public virtual Team Team { get; set; }

    public virtual Game Game { get; set; }

    public virtual Player Player { get; set; }

    public virtual Penalty Penalty { get; set; }
    #endregion
  }
}