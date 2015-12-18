using System.ComponentModel.DataAnnotations;

namespace LO30.Web.Models.Objects
{
  public class ScoreSheetEntryGoalType
  {
    [Required, Key]
    public int ScoreSheetEntryGoalId { get; set; }

    [Required]
    public bool ShortHandedGoal { get; set; }

    [Required]
    public bool PowerPlayGoal { get; set; }

    [Required]
    public bool GameWinningGoal { get; set; }
  }
}