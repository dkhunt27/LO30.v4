using System;
using System.ComponentModel.DataAnnotations;

namespace LO30.Web.Models.Objects
{
  public class GoalieStatCareer
  {
    [Required]
    public int PlayerId { get; set; }

    [Required]
    public int Seasons { get; set; }

    [Required]
    public int Games { get; set; }

    [Required]
    public int GoalsAgainst { get; set; }

    [Required]
    public int Shutouts { get; set; }

    [Required]
    public int Wins { get; set; }

    #region foreign keys
    // items in the classes below must exist before an item in this class

    public virtual Player Player { get; set; }
    #endregion
  }
}