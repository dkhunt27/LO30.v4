using System;
using System.ComponentModel.DataAnnotations;

namespace LO30.Web.Models.Objects
{
  public class ScoreSheetEntryEvent
  {
    [Required, Key]
    public int ScoreSheetEntryEventId { get; set; }

    [Required]
    public int GameId { get; set; }

    [Required]
    public TimeSpan TimeElapsed { get; set; }

    [Required]
    public ScoreSheetEntryEventType EventType { get; set; }

    public int? ScoreSheetEntryGoalId { get; set; }

    public int? ScoreSheetEntryPenaltyId { get; set; }

    [Required]
    public bool HomeTeam { get; set; }

    [Required]
    public bool MatchPenalty { get; set; }
  }

  public enum ScoreSheetEntryEventType
  {
    // PenaltyStart is first, so if penalty starts and goal happen at same time, counts as power play goal
    // PenaltyEnd is last, so if penalty ends and goal happen at same time, counts as power play goal
    PenaltyStart = 0,
    Goal = 1,
    PenaltyEnd = 2,
  }
}