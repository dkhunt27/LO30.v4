using System;
using System.ComponentModel.DataAnnotations;

namespace LO30.Web.ViewModels.Api
{
  public class GoalieStatCareerViewModel
  {
    [Required]
    public int PlayerId { get; set; }

    [Required]
    public int Seasons { get; set; }

    [Required]
    public int Games { get; set; }

    [Required]
    public int GoalsAgainst { get; set; }

    [Required]
    public double GoalsAgainstAverage
    {
      get
      {
        return (double)GoalsAgainst / (double)Games;
      }
    }

    [Required]
    public int Shutouts { get; set; }

    [Required]
    public int Wins { get; set; }

    [Required]
    public double WinPercent
    {
      get
      {
        return (double)Wins / (double)Games;
      }
    }

    [Required, MaxLength(35)]
    public string PlayerFirstName { get; set; }

    [Required, MaxLength(35)]
    public string PlayerLastName { get; set; }

    [MaxLength(5)]
    public string PlayerSuffix { get; set; }
  }
}