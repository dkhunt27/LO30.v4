using System.ComponentModel.DataAnnotations;

namespace LO30.Web.ViewModels.Api
{
  public class SeasonViewModel
  {
    [Required]
    public int SeasonId { get; set; }

    [Required, MaxLength(12)]
    public string SeasonName { get; set; }

    [Required]
    public bool IsCurrentSeason { get; set; }
  }
}
