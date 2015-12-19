using System.ComponentModel.DataAnnotations;

namespace LO30.Web.Models.Objects
{
  public class TeamRoster
  {
    [Required]
    public int TeamId { get; set; }

    [Required]
    public int PlayerId { get; set; }

    [Required]
    public int SeasonId { get; set; }

    [Required]
    public int StartYYYYMMDD { get; set; }

    [Required]
    public int EndYYYYMMDD { get; set; }

    [Required, MaxLength(1)]
    public string Position { get; set; }

    [Required]
    public int RatingPrimary { get; set; }

    [Required]
    public int RatingSecondary { get; set; }

    [Required]
    public int Line { get; set; }

    [MaxLength(3)]
    public string PlayerNumber { get; set; }

    #region foreign keys
    // items in the classes below must exist before an item in this class

    public virtual Season Season { get; set; }

    public virtual Team Team { get; set; }

    public virtual Player Player { get; set; }
    #endregion
  }
}