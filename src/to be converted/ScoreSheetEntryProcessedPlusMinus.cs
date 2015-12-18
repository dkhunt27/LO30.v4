using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LO30.Web.Models.Objects
{
  public class ScoreSheetEntryProcessedPlusMinus
  {
    [Key, Column(Order = 1), DatabaseGenerated(DatabaseGeneratedOption.None)]
    public int ScoreSheetEntryGoalId { get; set; }

    [Required]
    public int PlayerId { get; set; }

    [Required]
    public int PlusMinus { get; set; }


    // virtual, foreign keys
    [ForeignKey("ScoreSheetEntryGoalId")]
    public virtual ScoreSheetEntryProcessedGoal ScoreSheetEntryGoal { get; set; }

    [ForeignKey("PlayerId")]
    public virtual Player Player { get; set; }
  }
}