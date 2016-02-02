using System.ComponentModel.DataAnnotations;

namespace LO30.Web.ViewModels.Api
{
  public class TeamViewModel
  {
    [Required]
    public int TeamId { get; set; }

    [Required]
    public int SeasonId { get; set; }

    [Required, MaxLength(5)]
    public string TeamCode { get; set; }

    [Required, MaxLength(15)]
    public string TeamNameShort { get; set; }

    [Required, MaxLength(35)]
    public string TeamNameLong { get; set; }

    [Required]
    public int DivisionId { get; set; }

    public int? CoachId { get; set; }

    public int? SponsorId { get; set; }

    [Required, MaxLength(50)]
    public string DivisionLongName { get; set; }

    [Required, MaxLength(15)]
    public string DivisionShortName { get; set; }

    [Required, MaxLength(12)]
    public string SeasonName { get; set; }
  }
}
