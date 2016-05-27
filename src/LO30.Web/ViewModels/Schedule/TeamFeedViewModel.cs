using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace LO30.Web.ViewModels.Schedule
{
  public class TeamFeedViewModel
  {
    public string TeamCode { get; set; }

    public string TeamNameShort { get; set; }

    public string TeamNameLong { get; set; }

    public string TeamFeedUrl { get; set; }
  }
}
