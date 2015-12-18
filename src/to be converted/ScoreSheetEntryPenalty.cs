using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LO30.Web.Models.Objects
{
  public class ScoreSheetEntryPenalty
  {
    [Key, Column(Order = 1), DatabaseGenerated(DatabaseGeneratedOption.None)]
    public int ScoreSheetEntryPenaltyId { get; set; }

    [Required]
    public int GameId { get; set; }

    [Required]
    public int Period { get; set; }

    [Required]
    public bool HomeTeam { get; set; }

    [Required]
    public string Player { get; set; }

    [Required, MaxLength(3)]
    public string PenaltyCode { get; set; }

    [Required, MaxLength(5)]
    public string TimeRemaining { get; set; }
    
    [Required]
    public int PenaltyMinutes { get; set; }

    [Required]
    public DateTime UpdatedOn { get; set; }

    // virtual, foreign keys
    [ForeignKey("GameId")]
    public virtual Game Game { get; set; }
  }
}