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
  [Route("api/games")]
  public class GameController : Controller
  {
    private LO30DbContext _context;

    public GameController(LO30DbContext context)
    {
      _context = context;
    }

    [HttpGet("seasons/{seasonId:int}")]
    public JsonResult ListGamesForSeasonId(int seasonId)
    {
      List<Game> results;
      using (_context)
      {
        results = _context.Games.Where(x=>x.SeasonId == seasonId).ToList();
      }

      return Json(results.OrderBy(x=>x.GameId));
    }
  }
}
