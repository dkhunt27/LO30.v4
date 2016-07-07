using AutoMapper;
using LO30.Web.Models;
using LO30.Web.Models.Objects;
using LO30.Web.ViewModels.Api;
using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using System.Collections.Generic;
using System.Linq;

namespace LO30.Web.Controllers.Api
{
  [Route("api/goaliestatgames")]
  public class GoalieStatGameController : Controller
  {
    private LO30DbContext _context;

    public GoalieStatGameController(LO30DbContext context)
    {
      _context = context;
    }

    // goalies (season tab)
    [HttpGet("goalies/{playerId:int}/seasons/{seasonId:int}")]
    public JsonResult ListForPlayerIdSeasonId(int playerId, int seasonId)
    {
      List<GoalieStatGame> results;
      using (_context)
      {
        results = _context.GoalieStatGames
                          .Include(x => x.Game)
                          .Include(x => x.Team)
                          .Include(x => x.Player)
                          .Where(x => x.SeasonId == seasonId && x.PlayerId == playerId)
                          .ToList();
      }

      return Json(Mapper.Map<IEnumerable<GoalieStatGameViewModel>>(results));
    }

    // box score scoring detail
    [HttpGet("games/{gameId:int}")]
    public JsonResult ListForGameId(int gameId)
    {
      List<GoalieStatGame> results;
      using (_context)
      {
        results = _context.GoalieStatGames
                          .Include(x => x.Game)
                          .Include(x => x.Team)
                          .Include(x => x.Player)
                          .Where(x => x.GameId == gameId)
                          .ToList();
      }

      return Json(Mapper.Map<IEnumerable<GoalieStatGameViewModel>>(results));
    }
  }
}
