using System;
using System.ComponentModel.DataAnnotations;

namespace LO30.Web.ViewModels.Api
{
  public class ScoreSheetEntryPenaltyViewModel
  {
    [Required]
    public int ScoreSheetEntryPenaltyId { get; set; }

    [Required]
    public int GameId { get; set; }

    [Required]
    public int Period { get; set; }

    [Required]
    public bool HomeTeam { get; set; }

    [Required]
    public string Player { get; set; }

    [Required, MaxLength(3)]
    public string PenaltyCode { get; set; }

    [Required, MaxLength(5)]
    public string TimeRemaining { get; set; }

    [Required]
    public int PenaltyMinutes { get; set; }
  }
}