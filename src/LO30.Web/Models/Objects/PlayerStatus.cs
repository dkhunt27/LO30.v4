using System.ComponentModel.DataAnnotations;

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

    #region foreign keys
    // items in the classes below must exist before an item in this class

    public virtual Player Player { get; set; }

    public virtual PlayerStatusType PlayerStatusType { get; set; }
    #endregion
  }
}