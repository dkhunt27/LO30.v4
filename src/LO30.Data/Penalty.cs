using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LO30.Data
{
  public class Penalty
  {
    [Key]
    public int PenaltyId { get; set; }

    [Required, MaxLength(3)]
    public string PenaltyCode { get; set; }

    [Required, MaxLength(30)]
    public string PenaltyName { get; set; }

    [Required]
    public int DefaultPenaltyMinutes { get; set; }

    [Required]
    public bool StickPenalty { get; set; }

    #region foreign keys referenced in another class
    // items in this class must exist before items in the classes below

    public virtual List<ScoreSheetEntryProcessedPenalty> ScoreSheetEntryProcessedPenalties { get; set; }
    #endregion
  }
}