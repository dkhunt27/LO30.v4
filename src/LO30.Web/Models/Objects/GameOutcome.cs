using System;
using System.ComponentModel.DataAnnotations;

namespace LO30.Web.Models.Objects
{
  public class GameOutcome
  {
    [Required]
    public int GameId { get; set; }

    [Required]
    public int TeamId { get; set; }

    [Required]
    public bool HomeTeam { get; set; }

    [Required, MaxLength(1)]
    public string Outcome { get; set; }

    [Required]
    public int GoalsFor { get; set; }

    [Required]
    public int GoalsAgainst { get; set; }

    [Required]
    public int PenaltyMinutes { get; set; }

    [Required]
    public int Subs { get; set; }

    [Required]
    public bool Overriden { get; set; }

    [Required]
    public int OpponentTeamId { get; set; }

    [Required]
    public int SeasonId { get; set; }

    #region foreign keys
    // items in the classes below must exist before an item in this class

    public virtual Season Season { get; set; }

    public virtual Team Team { get; set; }

    public virtual Game Game { get; set; }

    public virtual Team OpponentTeam { get; set; }
    #endregion
  }
}