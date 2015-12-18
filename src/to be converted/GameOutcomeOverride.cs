using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LO30.Web.Models.Objects
{
  public class GameOutcomeOverride
  {
    [Required, Key, Column(Order = 1)]
    public int GameId { get; set; }

    [Required, Key, Column(Order = 2)]
    public int TeamId { get; set; }

    [Required, MaxLength(1)]
    public string Outcome { get; set; }

    [Required]
    public int SeasonId { get; set; }

    // virtual, foreign keys
    [ForeignKey("SeasonId")]
    public virtual Season Season { get; set; }

    [ForeignKey("TeamId")]
    public virtual Team Team { get; set; }

    [ForeignKey("GameId")]
    public virtual Game Game { get; set; }
  }
}