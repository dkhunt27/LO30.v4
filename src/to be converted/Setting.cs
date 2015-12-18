using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LO30.Web.Models.Objects
{
  public class Setting
  {
    [Required, Key, Column(Order = 1)]
    public int SettingId { get; set; }

    [Required, MaxLength(35), Index("PK2", 1, IsUnique = true)]
    public string SettingName { get; set; }

    [Required]
    public string SettingValue { get; set; }
  }
}