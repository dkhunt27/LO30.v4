using System;
using System.ComponentModel.DataAnnotations;

namespace LO30.Data
{
  public class ScoreSheetEntryProcessedSub
  {
    [Required]
    public int ScoreSheetEntrySubId { get; set; }

    [Required]
    public int SeasonId { get; set; }

    [Required]
    public int TeamId { get; set; }

    [Required]
    public int GameId { get; set; }

    [Required]
    public int SubPlayerId { get; set; }

    [Required]
    public int SubbingForPlayerId { get; set; }

    [Required]
    public bool HomeTeam { get; set; }

    [Required, MaxLength(5)]
    public string JerseyNumber { get; set; }

    #region foreign keys
    // items in the classes below must exist before an item in this class

    public virtual Season Season { get; set; }

    public virtual Team Team { get; set; }

    public virtual Game Game { get; set; }

    public virtual Player SubPlayer { get; set; }

    public virtual Player SubbingForPlayer { get; set; }
    #endregion
  }
}