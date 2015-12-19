using System;
using System.ComponentModel.DataAnnotations;

namespace LO30.Web.Models.Objects
{
  public class GameRoster
  {
    private const int _gridDefault = 0;

    [Required]
    public int GameRosterId { get; set; }

    [Required]
    public int GameId { get; set; }

    [Required]
    public int TeamId { get; set; }

    [Required]
    public string PlayerNumber { get; set; }

    [Required]
    public int PlayerId { get; set; }

    [Required, MaxLength(1)]
    public string Position { get; set; }

    [Required]
    public int RatingPrimary { get; set; }

    [Required]
    public int RatingSecondary { get; set; }

    [Required]
    public int Line { get; set; }

    [Required]
    public bool Goalie { get; set; }

    [Required]
    public bool Sub { get; set; }

    public int? SubbingForPlayerId { get; set; }

    [Required]
    public int SeasonId { get; set; }

    #region foreign keys
    // items in the classes below must exist before an item in this class

    public virtual Season Season { get; set; }

    public virtual Team Team { get; set; }

    public virtual Game Game { get; set; }

    public virtual Player Player { get; set; }

    public virtual Player SubbingForPlayer { get; set; }
    #endregion
  }
}