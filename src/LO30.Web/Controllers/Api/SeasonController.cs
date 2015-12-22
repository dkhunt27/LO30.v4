using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using LO30.Web.Models.Context;
using LO30.Web.Models.Objects;
using Microsoft.Data.Entity;

namespace LO30.Web.Controllers.Api
{
  [Route("api/seasons")]
  public class SeasonController : Controller
  {
    private LO30DbContext _context;

    public SeasonController(LO30DbContext context)
    {
      _context = context;
    }

    [HttpGet("")]
    public JsonResult ListSeasons()
    {
      List<Season> results;
      using (_context)
      {
        results = _context.Seasons.ToList();
      }

      return Json(results.OrderBy(x=>x.SeasonId));
    }
  }
}
