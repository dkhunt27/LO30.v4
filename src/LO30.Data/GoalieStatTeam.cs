using System;
using System.ComponentModel.DataAnnotations;

namespace LO30.Data
{
  public class GoalieStatTeam
  {
    [Required]
    public int PlayerId { get; set; }

    [Required]
    public int TeamId { get; set; }

    [Required]
    public bool Playoffs { get; set; }

    [Required]
    public bool Sub { get; set; }

    [Required]
    public int SeasonId { get; set; }

    [Required]
    public int Games { get; set; }

    [Required]
    public int GoalsAgainst { get; set; }

    //[Required]
    //public double GoalsAgainstAverage
    //{ 
    //  get
    //  {
    //    return (double)GoalsAgainst / (double)Games;
    //  }
    //}

    [Required]
    public int Shutouts { get; set; }

    [Required]
    public int Wins { get; set; }
    
    #region foreign keys
    // items in the classes below must exist before an item in this class

    public virtual Season Season { get; set; }

    public virtual Team Team { get; set; }

    public virtual Player Player { get; set; }
    #endregion
  }
}