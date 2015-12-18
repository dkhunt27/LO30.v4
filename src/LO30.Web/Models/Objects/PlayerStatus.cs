using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LO30.Web.Models.Objects
{
  public class PlayerStatus
  {
    [Required]
    public int PlayerId { get; set; }

    [Required]
    public int PlayerStatusTypeId { get; set; }

    [Required]
    public int EventYYYYMMDD { get; set; }

    [Required]
    public bool CurrentStatus { get; set; }

    // virtual, foreign keys dependent
    public virtual Player Player { get; set; }
    public virtual PlayerStatusType PlayerStatusType { get; set; }
  }
}