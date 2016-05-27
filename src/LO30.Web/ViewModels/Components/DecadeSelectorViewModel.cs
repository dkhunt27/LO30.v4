using LO30.Web.ViewModels.Api;
using Microsoft.AspNet.Mvc.Rendering;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LO30.Web.ViewModels.Components
{
  public class DecadeSelectorViewModel
  {
    public string DecadeName { get; set; }

    public List<SeasonSelectorViewModel> Seasons { get; set; }
  }
}
