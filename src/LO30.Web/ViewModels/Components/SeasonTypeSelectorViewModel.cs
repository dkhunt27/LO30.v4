using LO30.Web.ViewModels.Api;
using Microsoft.AspNet.Mvc.Rendering;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LO30.Web.ViewModels.Components
{
  public class SeasonTypeSelectorViewModel
  {
    public int SeasonTypeId { get; set; }

    public string SeasonTypeName { get; set; }

    public bool IsSelected { get; set; }
  }
}
