using System;
using System.ComponentModel.DataAnnotations;

namespace LO30.Web.ViewModels.Api
{
  public class ScoreSheetEntryProcessedSubViewModel
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
    
    [Required, MaxLength(5)]
    public string TeamCode { get; set; }

    [Required, MaxLength(15)]
    public string TeamNameShort { get; set; }

    [Required, MaxLength(35)]
    public string TeamNameLong { get; set; }

    [Required, MaxLength(35)]
    public string SubPlayerFirstName { get; set; }

    [Required, MaxLength(35)]
    public string SubPlayerLastName { get; set; }

    [MaxLength(5)]
    public string SubPlayerSuffix { get; set; }

    [Required, MaxLength(35)]
    public string SubbingForPlayerFirstName { get; set; }

    [Required, MaxLength(35)]
    public string SubbingForPlayerLastName { get; set; }

    [MaxLength(5)]
    public string SubbingForPlayerSuffix { get; set; }

  }
}