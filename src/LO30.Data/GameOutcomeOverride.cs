using System.ComponentModel.DataAnnotations;

namespace LO30.Data
{
  public class GameOutcomeOverride
  {
    [Required]
    public int GameId { get; set; }

    [Required]
    public int TeamId { get; set; }

    [Required, MaxLength(1)]
    public string Outcome { get; set; }

    [Required]
    public int SeasonId { get; set; }

    #region foreign keys
    // items in the classes below must exist before an item in this class

    public virtual Season Season { get; set; }

    public virtual Team Team { get; set; }

    public virtual Game Game { get; set; }
    #endregion
  }
}