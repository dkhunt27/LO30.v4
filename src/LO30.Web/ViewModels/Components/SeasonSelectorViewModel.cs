using LO30.Web.ViewModels.Api;
using Microsoft.AspNet.Mvc.Rendering;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LO30.Web.ViewModels.Components
{
  public class SeasonSelectorViewModel
  {
    public int SeasonId { get; set; }

    public string SeasonName { get; set; }

    public bool IsSelected { get; set; }
  }
}
