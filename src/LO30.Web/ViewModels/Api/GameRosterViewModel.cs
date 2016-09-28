using LO30.Data;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LO30.Web.ViewModels.Api
{
  public class GameRosterViewModel
  {
    [Required]
    public int GameRosterId { get; set; }

    [Required]
    public int GameId { get; set; }

    [Required]
    public int TeamId { get; set; }

    [Required, MaxLength(3)]
    public string PlayerNumber { get; set; }

    [Required]
    public int PlayerId { get; set; }

    [Required, MaxLength(1)]
    public string Position { get; set; }

    [Required, MaxLength(3)]
    public string RatingPrimary { get; set; }

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

    [Required, MaxLength(5)]
    public string TeamCode { get; set; }

    [Required, MaxLength(15)]
    public string TeamNameShort { get; set; }

    [Required, MaxLength(35)]
    public string TeamNameLong { get; set; }
    
    [Required, MaxLength(12)]
    public string SeasonName { get; set; }

    [Required, MaxLength(35)]
    public string PlayerFirstName { get; set; }

    [Required, MaxLength(35)]
    public string PlayerLastName { get; set; }

    [MaxLength(5)]
    public string PlayerSuffix { get; set; }

    [Required, MaxLength(35)]
    public string SubbingForPlayerFirstName { get; set; }

    [Required, MaxLength(35)]
    public string SubbingForPlayerLastName { get; set; }

    [MaxLength(5)]
    public string SubbingForPlayerSuffix { get; set; }

    [Required]
    public DateTime GameDateTime { get; set; }

    [Required]
    public int GameYYYYMMDD { get; set; }
  }
}
