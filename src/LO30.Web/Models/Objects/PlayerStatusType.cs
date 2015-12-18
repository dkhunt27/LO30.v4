using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LO30.Web.Models.Objects
{
  public class PlayerStatusType
  {
    [Required]
    public int PlayerStatusTypeId { get; set; }

    [Required, MaxLength(25)]
    public string PlayerStatusTypeName { get; set; }

    // virtual, foreign key principal
    public virtual List<PlayerStatus> PlayerStatuses { get; set; }
  }
}