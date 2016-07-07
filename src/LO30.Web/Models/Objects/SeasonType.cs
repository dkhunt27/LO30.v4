using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LO30.Web.Models.Objects
{
  public class SeasonType
  {
    [Required]
    public int SeasonTypeId { get; set; }

    [Required, MaxLength(15)]
    public string SeasonTypeName { get; set; }
  }
}