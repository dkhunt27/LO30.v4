using System;
using System.ComponentModel.DataAnnotations;

namespace LO30.Web.ViewModels.Api
{
  public class ScoreSheetEntryProcessedGoalViewModel
  {
    [Required]
    public int ScoreSheetEntryGoalId { get; set; }

    [Required]
    public int SeasonId { get; set; }

    [Required]
    public int TeamId { get; set; }

    [Required]
    public int GameId { get; set; }

    [Required]
    public int Period { get; set; }

    [Required]
    public bool HomeTeam { get; set; }

    [Required]
    public int GoalPlayerId { get; set; }

    public int? Assist1PlayerId { get; set; }

    public int? Assist2PlayerId { get; set; }

    public int? Assist3PlayerId { get; set; }

    [Required, MaxLength(5)]
    public string TimeRemaining { get; set; }

    public TimeSpan TimeElapsed { get; set; }

    [Required]
    public bool ShortHandedGoal { get; set; }

    [Required]
    public bool PowerPlayGoal { get; set; }

    [Required]
    public bool GameWinningGoal { get; set; }

    [Required, MaxLength(5)]
    public string TeamCode { get; set; }

    [Required, MaxLength(15)]
    public string TeamNameShort { get; set; }

    [Required, MaxLength(35)]
    public string TeamNameLong { get; set; }

    [Required, MaxLength(35)]
    public string GoalPlayerFirstName { get; set; }

    [Required, MaxLength(35)]
    public string GoalPlayerLastName { get; set; }

    [MaxLength(5)]
    public string GoalPlayerSuffix { get; set; }

    [MaxLength(35)]
    public string Assist1PlayerFirstName { get; set; }

    [MaxLength(35)]
    public string Assist1PlayerLastName { get; set; }

    [MaxLength(5)]
    public string Assist1PlayerSuffix { get; set; }

    [MaxLength(35)]
    public string Assist2PlayerFirstName { get; set; }

    [MaxLength(35)]
    public string Assist2PlayerLastName { get; set; }

    [MaxLength(5)]
    public string Assist2PlayerSuffix { get; set; }

    [MaxLength(35)]
    public string Assist3PlayerFirstName { get; set; }

    [MaxLength(35)]
    public string Assist3PlayerLastName { get; set; }

    [MaxLength(5)]
    public string Assist3PlayerSuffix { get; set; }
  }
}