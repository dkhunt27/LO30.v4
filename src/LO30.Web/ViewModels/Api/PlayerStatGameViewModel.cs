using System;
using System.ComponentModel.DataAnnotations;

namespace LO30.Web.ViewModels.Api
{
  public class PlayerStatGameViewModel
  {
    [Required]
    public int PlayerId { get; set; }

    [Required, MaxLength(35)]
    public string FirstName { get; set; }

    [Required, MaxLength(35)]
    public string LastName { get; set; }

    [MaxLength(5)]
    public string Suffix { get; set; }

    [Required, MaxLength(5)]
    public string TeamCode { get; set; }

    [Required, MaxLength(15)]
    public string TeamNameShort { get; set; }

    [Required, MaxLength(35)]
    public string TeamNameLong { get; set; }

    [Required]
    public int SeasonId { get; set; }

    [Required]
    public int GameId { get; set; }

    [Required]
    public DateTime GameDateTime { get; set; }

    [Required]
    public bool Playoffs { get; set; }

    [Required]
    public bool Sub { get; set; }

    [Required]
    public int Line { get; set; }

    [Required, MaxLength(1)]
    public string Position { get; set; }

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

    [Required, MaxLength(5)]
    public string TeamCodeOpponent { get; set; }

    [Required, MaxLength(15)]
    public string TeamNameShortOpponent { get; set; }

    [Required, MaxLength(35)]
    public string TeamNameLongOpponent { get; set; }
  }
}