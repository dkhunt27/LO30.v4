using LO30.Data;
using LO30.Web.ViewModels.Utils;
using System;
using System.ComponentModel.DataAnnotations;

namespace LO30.Web.ViewModels.Crud
{
  public class PlayerViewModel : BaseValidatableViewModel<PlayerViewModel, Player>
  {
    [Required]
    public int PlayerId { get; set; }

    [Required, MaxLength(35)]
    public string FirstName { get; set; }

    [Required, MaxLength(35)]
    public string LastName { get; set; }

    [MaxLength(5)]
    public string Suffix { get; set; }

    [Required, MaxLength(1)]
    public string PreferredPosition { get; set; }

    [Required, MaxLength(1)]
    public string Shoots { get; set; }

    public DateTime? BirthDate { get; set; }

    public string Profession { get; set; }

    public string WifesName { get; set; }
  }
}