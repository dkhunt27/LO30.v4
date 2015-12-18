using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LO30.Web.Models.Objects
{
  public class ScoreSheetEntrySub
  {
    [Required, Key, Column(Order = 1), DatabaseGenerated(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.None)]
    public int ScoreSheetEntrySubId { get; set; }

    [Required, ForeignKey("Game")]
    public int GameId { get; set; }

    [Required]
    public int SubPlayerId { get; set; }

    [Required]
    public bool HomeTeam { get; set; }

    [Required]
    public int SubbingForPlayerId { get; set; }

    [Required, MaxLength(5)]
    public string JerseyNumber { get; set; }

    [Required]
    public DateTime UpdatedOn { get; set; }

    // virtual, foreign keys
    public virtual Game Game { get; set; }
  }
}