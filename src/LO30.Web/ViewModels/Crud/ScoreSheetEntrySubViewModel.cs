using LO30.Data;
using LO30.Web.ViewModels.Utils;
using System;
using System.ComponentModel.DataAnnotations;

namespace LO30.Web.ViewModels.Crud
{
  public class ScoreSheetEntrySubViewModel : BaseValidatableViewModel<ScoreSheetEntrySubViewModel, ScoreSheetEntrySub>
  {
    [Required]
    public int ScoreSheetEntrySubId { get; set; }

    [Required]
    public int GameId { get; set; }

    [Required]
    public int SubPlayerId { get; set; }

    [Required]
    public bool HomeTeam { get; set; }

    [Required]
    public int SubbingForPlayerId { get; set; }

    [Required, MaxLength(5)]
    public string JerseyNumber { get; set; }
  }
}