using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LO30.Web.Models.Objects
{
  public class Penalty
  {
    [Key, Column(Order = 0), DatabaseGenerated(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.None)]
    public int PenaltyId { get; set; }

    [Required, MaxLength(3)]
    public string PenaltyCode { get; set; }

    [Required, MaxLength(30)]
    public string PenaltyName { get; set; }

    [Required]
    public int DefaultPenaltyMinutes { get; set; }

    [Required]
    public bool StickPenalty { get; set; }
  }
}