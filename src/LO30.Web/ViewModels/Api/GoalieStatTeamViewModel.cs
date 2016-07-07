using System;
using System.ComponentModel.DataAnnotations;

namespace LO30.Web.ViewModels.Api
{
  public class GoalieStatTeamViewModel
  {
    [Required]
    public int PlayerId { get; set; }

    [Required]
    public int SeasonId { get; set; }

    [Required]
    public int TeamId { get; set; }

    [Required]
    public bool Playoffs { get; set; }

    [Required]
    public bool Sub { get; set; }

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

    [Required, MaxLength(15)]
    public string PlayerNameCode { get; set; }

    [Required, MaxLength(25)]
    public string PlayerNameShort { get; set; }

    [Required, MaxLength(50)]
    public string PlayerNameLong { get; set; }

    [Required, MaxLength(35)]
    public string PlayerFirstName { get; set; }

    [Required, MaxLength(35)]
    public string PlayerLastName { get; set; }

    [MaxLength(5)]
    public string PlayerSuffix { get; set; }

    [Required, MaxLength(5)]
    public string TeamCode { get; set; }

    [Required, MaxLength(15)]
    public string TeamNameShort { get; set; }

    [Required, MaxLength(35)]
    public string TeamNameLong { get; set; }
  }
}