using LO30.Data;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LO30.Web.ViewModels.Api
{
  public class TeamRosterViewModel
  {
    [Required]
    public int TeamId { get; set; }

    [Required]
    public int PlayerId { get; set; }

    [Required]
    public int SeasonId { get; set; }

    [Required]
    public int StartYYYYMMDD { get; set; }

    [Required]
    public int EndYYYYMMDD { get; set; }

    [Required, MaxLength(1)]
    public string Position { get; set; }

    [Required, MaxLength(3)]
    public string RatingPrimary { get; set; }

    [Required]
    public int RatingSecondary { get; set; }

    [Required]
    public int Line { get; set; }

    [MaxLength(3)]
    public string PlayerNumber { get; set; }

    [Required, MaxLength(5)]
    public string TeamCode { get; set; }

    [Required, MaxLength(15)]
    public string TeamNameShort { get; set; }

    [Required, MaxLength(35)]
    public string TeamNameLong { get; set; }
    
    [Required, MaxLength(12)]
    public string SeasonName { get; set; }

    [Required, MaxLength(35)]
    public string PlayerFirstName { get; set; }

    [Required, MaxLength(35)]
    public string PlayerLastName { get; set; }

    [MaxLength(5)]
    public string PlayerSuffix { get; set; }
  }
}
