using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using LO30.Web.Models.Context;

namespace LO30.Web.Controllers.Web
{
  public class NgController : Controller
  {
    private LO30DbContext _context;

    public NgController(LO30DbContext context)
    {
      _context = context;
    }

    public IActionResult Index()
    {
      var seasons = _context.Seasons.ToList();

      return View();
    }
  }
}
