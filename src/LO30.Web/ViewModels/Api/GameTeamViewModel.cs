using LO30.Data;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LO30.Web.ViewModels.Api
{
  public class GameTeamViewModel
  {
    [Required]
    public int GameId { get; set; }

    [Required]
    public int TeamId { get; set; }

    [Required]
    public bool HomeTeam { get; set; }

    [Required]
    public int OpponentTeamId { get; set; }

    [Required]
    public int SeasonId { get; set; }

    [Required, MaxLength(5)]
    public string TeamCode { get; set; }

    [Required, MaxLength(15)]
    public string TeamNameShort { get; set; }

    [Required, MaxLength(35)]
    public string TeamNameLong { get; set; }
    
    [Required, MaxLength(12)]
    public string SeasonName { get; set; }

    [Required]
    public DateTime GameDateTime { get; set; }

    [Required]
    public int GameYYYYMMDD { get; set; }

    [Required, MaxLength(5)]
    public string OpponentTeamCode { get; set; }

    [Required, MaxLength(15)]
    public string OpponentTeamNameShort { get; set; }

    [Required, MaxLength(35)]
    public string OpponentTeamNameLong { get; set; }
  }
}
