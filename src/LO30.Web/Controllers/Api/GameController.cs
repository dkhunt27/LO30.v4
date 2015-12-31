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
  [Route("api/games")]
  public class GameController : Controller
  {
    private LO30DbContext _context;

    public GameController(LO30DbContext context)
    {
      _context = context;
    }

    [HttpGet("seasons/{seasonId:int}")]
    public JsonResult ListForSeasonId(int seasonId)
    {
      List<Game> results;
      using (_context)
      {
        results = _context.Games.Where(x=>x.SeasonId == seasonId).ToList();
      }

      return Json(results.OrderBy(x=>x.GameId));
    }

    [HttpGet("{gameId:int}")]
    public JsonResult GetForGameId(int gameId)
    {
      Game results;
      using (_context)
      {
        // TODO, more research...Team isn't getting populated, but opponentteam is
        results = _context.Games
                            .Include(x => x.Season)
                            .Include(x => x.GameOutcomes)
                            .Include(x => x.GameScores)
                            .Include(x => x.GameTeams).ThenInclude(y => y.Team)
                            .Include(x => x.GameTeams).ThenInclude(y => y.OpponentTeam)
                            .Where(x => x.GameId == gameId)
                            .SingleOrDefault();
      }

      return Json(Mapper.Map<GameCompositeViewModel>(results));
    }
  }
}
