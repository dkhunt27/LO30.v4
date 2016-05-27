using System;
using System.ComponentModel.DataAnnotations;

namespace LO30.Web.Models.Objects
{
  public class ScoreSheetEntryPenalty
  {
    [Required]
    public int ScoreSheetEntryPenaltyId { get; set; }

    [Required]
    public int GameId { get; set; }

    [Required]
    public int Period { get; set; }

    [Required]
    public bool HomeTeam { get; set; }

    [Required]
    public string Player { get; set; }

    [Required, MaxLength(3)]
    public string PenaltyCode { get; set; }

    [Required, MaxLength(5)]
    public string TimeRemaining { get; set; }
    
    [Required]
    public int PenaltyMinutes { get; set; }

    #region foreign keys
    // items in the classes below must exist before an item in this class

    public virtual Game Game { get; set; }
    #endregion
  }
}