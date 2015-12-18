using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LO30.Web.Models.Objects
{
  public class ForWebGoodThru
  {
    [Required, Key, Column(Order = 1)]
    public int ID { get; set; }

    [Required, MaxLength(25)]
    public string GT { get; set; }
  }
}