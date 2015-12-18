using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LO30.Web.Models.Objects
{
  public class Division
  {
    [Required]
    public int DivisionId { get; set; }

    [Required, MaxLength(50)]
    public string DivisionLongName { get; set; }

    [Required, MaxLength(15)]
    public string DivisionShortName { get; set; }

    // virtual, foreign key principal
    public virtual List<Team> DivisionalTeams { get; set; }
  }
}