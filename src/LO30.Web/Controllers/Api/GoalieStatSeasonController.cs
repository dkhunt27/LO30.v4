using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using LO30.Web.Models.Context;
using LO30.Web.Models.Objects;
using Microsoft.Data.Entity;
using AutoMapper;
using LO30.Web.ViewModels.Api;

namespace LO30.Web.Controllers.Api
{
  [Route("api/goaliestatseasons")]
  public class GoalieStatSeasonController : Controller
  {
    private LO30DbContext _context;

    public GoalieStatSeasonController(LO30DbContext context)
    {
      _context = context;
    }

    [HttpGet("players/{playerId:int}")]
    public JsonResult ListForPlayerId(int playerId)
    {
      List<GoalieStatSeasonNoPlayoffs> results;
      using (_context)
      {

        var tempResults = _context.GoalieStatSeasons
                          .Include(x => x.Player)
                          .Include(x => x.Season)
                          .Where(x => x.PlayerId == playerId)
                          .ToList();

        results = tempResults
                          .GroupBy(x => new { x.PlayerId, x.Player, x.SeasonId, x.Season })
                          .Select(grp => new GoalieStatSeasonNoPlayoffs
                          {
                            PlayerId = grp.Key.PlayerId,
                            Player = grp.Key.Player,
                            SeasonId = grp.Key.SeasonId,
                            Season = grp.Key.Season,
                            Games = grp.Sum(x => x.Games),
                            GoalsAgainst = grp.Sum(x => x.GoalsAgainst),
                            Wins = grp.Sum(x => x.Wins),
                            Shutouts = grp.Sum(x => x.Shutouts)
                          })
                        .ToList();
      }

      return Json(Mapper.Map<IEnumerable<GoalieStatSeasonNoPlayoffsViewModel>>(results));
    }

  }
}
