using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LO30.Web.ViewModels.Api
{
  public class GameCompositeViewModel
  {
    [Required]
    public int GameId { get; set; }

    [Required]
    public int SeasonId { get; set; }

    [Required]
    public bool Playoffs { get; set; }

    [Required]
    public DateTime GameDateTime { get; set; }

    [Required]
    public int GameYYYYMMDD { get; set; }

    [Required, MaxLength(15)]
    public string Location { get; set; }

    [Required, MaxLength(12)]
    public string SeasonName { get; set; }

    [Required]
    public int TeamIdAway { get; set; }

    [Required, MaxLength(5)]
    public string TeamCodeAway { get; set; }

    [Required, MaxLength(15)]
    public string TeamNameShortAway { get; set; }

    [Required, MaxLength(35)]
    public string TeamNameLongAway { get; set; }

    public string OutcomeAway { get; set; }

    public int GoalsForAway { get; set; }

    public int GoalsAgainstAway { get; set; }

    public int PenaltyMinutesAway { get; set; }

    public int SubsAway { get; set; }

    public bool OverridenAway { get; set; }

    public int Period1ScoreAway { get; set; }

    public int Period2ScoreAway { get; set; }

    public int Period3ScoreAway { get; set; }

    public int Period4ScoreAway { get; set; }

    [Required]
    public int TeamIdHome { get; set; }

    [Required, MaxLength(5)]
    public string TeamCodeHome { get; set; }

    [Required, MaxLength(15)]
    public string TeamNameShortHome { get; set; }

    [Required, MaxLength(35)]
    public string TeamNameLongHome { get; set; }

    public string OutcomeHome { get; set; }

    public int GoalsForHome { get; set; }

    public int GoalsAgainstHome { get; set; }

    public int PenaltyMinutesHome { get; set; }

    public int SubsHome { get; set; }

    public bool OverridenHome { get; set; }

    public int Period1ScoreHome { get; set; }

    public int Period2ScoreHome { get; set; }

    public int Period3ScoreHome { get; set; }

    public int Period4ScoreHome { get; set; }
  }
}