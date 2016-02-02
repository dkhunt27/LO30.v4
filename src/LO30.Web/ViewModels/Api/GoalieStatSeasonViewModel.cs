using System;
using System.ComponentModel.DataAnnotations;

namespace LO30.Web.ViewModels.Api
{
  public class GoalieStatSeasonViewModel
  {
    [Required]
    public int PlayerId { get; set; }

    [Required]
    public int SeasonId { get; set; }

    [Required]
    public bool Playoffs { get; set; }

    [Required]
    public int Games { get; set; }

    [Required]
    public int GoalsAgainst { get; set; }

    [Required]
    public int Shutouts { get; set; }

    [Required]
    public int Wins { get; set; }

    [Required, MaxLength(35)]
    public string PlayerFirstName { get; set; }

    [Required, MaxLength(35)]
    public string PlayerLastName { get; set; }

    [MaxLength(5)]
    public string PlayerSuffix { get; set; }

    [Required, MaxLength(12)]
    public string SeasonName { get; set; }
  }
}