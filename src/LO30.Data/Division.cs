using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LO30.Data
{
  public class Division
  {
    [Required]
    public int DivisionId { get; set; }

    [Required, MaxLength(50)]
    public string DivisionLongName { get; set; }

    [Required, MaxLength(15)]
    public string DivisionShortName { get; set; }

    #region foreign keys referenced in another class
    // items in this class must exist before items in the classes below

    public virtual List<Team> Teams { get; set; }

    public virtual List<TeamStanding> TeamStandings { get; set; }
    #endregion
  }
}