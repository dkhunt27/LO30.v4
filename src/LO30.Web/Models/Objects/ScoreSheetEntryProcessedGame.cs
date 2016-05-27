using System;
using System.ComponentModel.DataAnnotations;

namespace LO30.Web.Models.Objects
{
  public class ScoreSheetEntryProcessedGame
  {
    [Required]
    public int GameId { get; set; }

    [Required]
    public DateTime UpdatedOn { get; set; }

    #region foreign keys
    // items in the classes below must exist before an item in this class

    public virtual Game Game { get; set; }
    #endregion
  }
}