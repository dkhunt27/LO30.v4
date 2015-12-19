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
  [Route("api/dataprocessing")]
  public class DataProcessingController : Controller
  {
    private LO30DbContext _context;

    public DataProcessingController(LO30DbContext context)
    {
      _context = context;
    }

    [HttpGet("lastprocessedgameid/seasons/{seasonId:int}")]
    public JsonResult GetLastGameProcessedForSeasonId(int seasonId)
    {
      Game results;
      using (_context)
      {
        var seasonPSG = _context.PlayerStatGames
                       .Include(x => x.Game)
                       .Where(x => x.SeasonId == seasonId)
                       .ToList();

        var latestPSG = seasonPSG
                              .GroupBy(x => new { x.SeasonId })
                              .Select(grp => new
                              {
                                SeasonId = grp.Key.SeasonId,
                                GameDateTime = grp.Max(x => x.Game.GameDateTime)
                              })
                              .Where(x => x.SeasonId == seasonId)
                              .OrderByDescending(x => x.GameDateTime)
                              .ToList();


        results = latestPSG
            .Join(_context.Games,
                  x => x.GameDateTime,
                  y => y.GameDateTime,
                  (x, y) => new { x, y })
            .Select(m => new Game
            {
              GameId = m.y.GameId
            })
            .Single();

      }

      return Json(results);
    }
  }
}
