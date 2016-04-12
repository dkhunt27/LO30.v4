using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using Microsoft.Extensions.Logging;
using LO30.Web.Models.Context;

namespace LO30.Web.Controllers.Web
{
  public class HomeController : Controller
  {
    private ILogger<HomeController> _logger;
    private LO30DbContext _context;

    public HomeController(ILogger<HomeController> logger, LO30DbContext context)
    {
      _logger = logger;
      _context = context;
    }

    public IActionResult Index()
    {
      _logger.LogDebug("Index action requested at {requestTime}", DateTime.Now);

      return View();
    }

    public IActionResult News()
    {
      _logger.LogDebug("News action requested at {requestTime}", DateTime.Now);

      var seasonId = _context.Seasons.Where(x => x.IsCurrentSeason == true).Single().SeasonId;
      var seasonName = _context.Seasons.Where(x => x.SeasonId == seasonId).Single().SeasonName;

      ViewData["SeasonId"] = seasonId;
      ViewData["SeasonName"] = seasonName;

      return View();
    }

    public IActionResult Contact()
    {
      ViewData["Message"] = "Your contact page.";

      return View();
    }

    public IActionResult Error()
    {
      return View();
    }
  }
}
