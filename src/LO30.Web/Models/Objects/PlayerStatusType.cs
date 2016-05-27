using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LO30.Web.Models.Objects
{
  public class PlayerStatusType
  {
    [Required]
    public int PlayerStatusTypeId { get; set; }

    [Required, MaxLength(25)]
    public string PlayerStatusTypeName { get; set; }

    #region foreign keys referenced in another class
    // items in this class must exist before items in the classes below

    public virtual List<PlayerStatus> PlayerStatuses { get; set; }
    #endregion
  }
}