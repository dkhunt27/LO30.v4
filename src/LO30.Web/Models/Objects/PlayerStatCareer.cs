using System;
using System.ComponentModel.DataAnnotations;

namespace LO30.Web.Models.Objects
{
  public class PlayerStatCareer
  {
    [Required]
    public int PlayerId { get; set; }
    
    [Required]
    public int Seasons { get; set; }

    [Required]
    public int Games { get; set; }

    [Required]
    public int Goals { get; set; }

    [Required]
    public int Assists { get; set; }

    [Required]
    public int Points { get; set; }

    [Required]
    public int PenaltyMinutes { get; set; }

    [Required]
    public int PowerPlayGoals { get; set; }

    [Required]
    public int ShortHandedGoals { get; set; }

    [Required]
    public int GameWinningGoals { get; set; }

    #region foreign keys
    // items in the classes below must exist before an item in this class

    public virtual Player Player { get; set; }
    #endregion
  }
}