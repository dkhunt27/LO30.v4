using System.ComponentModel.DataAnnotations;

namespace LO30.Web.Models.Objects
{
  public class Setting
  {
    [Required]
    public int SettingId { get; set; }

    [Required, MaxLength(35)]
    public string SettingName { get; set; }

    [Required]
    public string SettingValue { get; set; }
  }
}