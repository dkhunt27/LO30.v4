﻿using System;
using System.ComponentModel.DataAnnotations;

namespace LO30.Web.ViewModels.Api
{
  public class PlayerStatSeasonViewModel
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
    public int Goals { get; set; }

    [Required]
    public int Assists { get; set; }

    [Required]
    public int Points { get; set; }

    [Required]
    public int PenaltyMinutes { get; set; }

    [Required]
    public int PowerPlayGoals { get; set; }

    [Required]
    public int ShortHandedGoals { get; set; }

    [Required]
    public int GameWinningGoals { get; set; }

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