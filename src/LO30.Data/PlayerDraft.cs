using System;
using System.ComponentModel.DataAnnotations;

namespace LO30.Data
{
  public class PlayerDraft
  {
    [Required]
    public int SeasonId { get; set; }

    [Required]
    public int PlayerId { get; set; }

    [Required]
    public int Round { get; set; }

    [Required]
    public int Order { get; set; }

    [Required, MaxLength(1)]
    public string Position { get; set; }

    [Required]
    public int Line { get; set; }

    [Required]
    public bool Special { get; set; }

    #region foreign keys
    // items in the classes below must exist before an item in this class

    public virtual Season Season { get; set; }

    public virtual Player Player { get; set; }
    #endregion
  }
}