using System.ComponentModel.DataAnnotations;

namespace LO30.Web.ViewModels.Api
{
  public class TeamStandingViewModel
  {
    [Required]
    public int TeamId { get; set; }

    [Required]
    public bool Playoffs { get; set; }

    [Required]
    public int SeasonId { get; set; }

    [Required]
    public int DivisionId { get; set; }

    [Required]
    public int Ranking { get; set; }

    [Required]
    public int Games { get; set; }

    [Required]
    public int Wins { get; set; }

    [Required]
    public double WinPercent
    {
      get
      {
        if (Games > 0)
        {
          return (double)Wins / (double)Games;
        }
        else
        {
          return 0;
        }
      }
    }

    [Required]
    public int Losses { get; set; }

    [Required]
    public int Ties { get; set; }

    [Required]
    public int Points { get; set; }

    [Required]
    public int GoalsFor { get; set; }

    [Required]
    public int GoalsAgainst { get; set; }

    [Required]
    public int PenaltyMinutes { get; set; }

    [Required]
    public int Subs { get; set; }

    [Required, MaxLength(5)]
    public string TeamCode { get; set; }

    [Required, MaxLength(15)]
    public string TeamNameShort { get; set; }

    [Required, MaxLength(35)]
    public string TeamNameLong { get; set; }

    [Required, MaxLength(50)]
    public string DivisionLongName { get; set; }

    [Required, MaxLength(15)]
    public string DivisionShortName { get; set; }

    [Required, MaxLength(12)]
    public string SeasonName { get; set; }
  }
}
