using System;
using System.ComponentModel.DataAnnotations;

namespace LO30.Web.Models.Objects
{
  public class ScoreSheetEntrySub
  {
    [Required]
    public int ScoreSheetEntrySubId { get; set; }

    [Required]
    public int GameId { get; set; }

    [Required]
    public int SubPlayerId { get; set; }

    [Required]
    public bool HomeTeam { get; set; }

    [Required]
    public int SubbingForPlayerId { get; set; }

    [Required, MaxLength(5)]
    public string JerseyNumber { get; set; }
    
    #region foreign keys
    // items in the classes below must exist before an item in this class

    public virtual Game Game { get; set; }
    #endregion
  }
}