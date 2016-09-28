using System;
using System.ComponentModel.DataAnnotations;

namespace LO30.Web.ViewModels.Api
{
  public class ScoreSheetEntrySubViewModel
  {
    [Required]
    public int ScoreSheetEntrySubId { get; set; }

    [Required]
    public int GameId { get; set; }

    [Required]
    public int SubPlayerId { get; set; }

    [Required]
    public bool HomeTeam { get; set; }

    [Required]
    public int SubbingForPlayerId { get; set; }

    [Required, MaxLength(5)]
    public string JerseyNumber { get; set; }
  }
}