using System;
using System.ComponentModel.DataAnnotations;

namespace LO30.Web.ViewModels.Api
{
  public class ScoreSheetEntryGoalViewModel
  {
    [Required]
    public int ScoreSheetEntryGoalId { get; set; }

    [Required]
    public int GameId { get; set; }

    [Required]
    public int Period { get; set; }

    [Required]
    public bool HomeTeam { get; set; }

    [Required]
    public string Goal { get; set; }

    public string Assist1 { get; set; }

    public string Assist2 { get; set; }

    public string Assist3 { get; set; }

    [Required, MaxLength(5)]
    public string TimeRemaining { get; set; }

    [MaxLength(2)]
    public string ShortHandedPowerPlay { get; set; }
  }
}