using System.ComponentModel.DataAnnotations;

namespace LO30.Data
{
  public class TeamStanding
  {
    [Required]
    public int TeamId { get; set; }

    [Required]
    public bool Playoffs { get; set; }

    [Required]
    public int SeasonId { get; set; }

    [Required]
    public int DivisionId { get; set; }

    [Required]
    public int Ranking { get; set; }

    [Required]
    public int Games { get; set; }

    [Required]
    public int Wins { get; set; }

    [Required]
    public int Losses { get; set; }

    [Required]
    public int Ties { get; set; }

    [Required]
    public int Points { get; set; }

    [Required]
    public int GoalsFor { get; set; }

    [Required]
    public int GoalsAgainst { get; set; }

    [Required]
    public int PenaltyMinutes { get; set; }

    [Required]
    public int Subs { get; set; }

    //[Required]
    public string LastX { get; set; }

    //[Required]
    public string Streak { get; set; }

    #region foreign keys
    // items in the classes below must exist before an item in this class

    public virtual Season Season { get; set; }

    public virtual Team Team { get; set; }

    public virtual Division Division { get; set; }
    #endregion
  }
}