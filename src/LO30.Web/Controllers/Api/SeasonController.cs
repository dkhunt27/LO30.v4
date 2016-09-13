using LO30.Data;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

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
    public JsonResult List()
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
