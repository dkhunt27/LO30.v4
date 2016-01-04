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

    [HttpGet("seasons/{seasonId:int}/teams/{teamId:int}")]
    public JsonResult ListForSeasonIdTeamId(int seasonId, int teamId)
    {
      List<GameTeam> results;

      using (_context)
      {
        results = _context.GameTeams
                          .Include(x => x.Season)
                          .Include(x => x.Team)
                          .Include(x => x.OpponentTeam)
                          .Include(x => x.Game).ThenInclude(y => y.GameOutcomes)
                          .Include(x => x.Game).ThenInclude(y => y.GameScores)
                          .Where(x => x.TeamId == teamId && x.SeasonId == seasonId)
                          .ToList();

        // only keep games with outcomes (for some reason doesn't work if in above query)
        //results = results
        //          .Where(x => x.Game.GameOutcomes.Any())
        //          .ToList();

        // HACK, for some reason, the team was not getting "included"
        results = results.Join(_context.Teams,
                    a => a.TeamId,
                    b => b.TeamId,
                    (a, b) => new { a, b })
                    .Select(m => new GameTeam
                    {
                      Game = m.a.Game,
                      GameId = m.a.GameId,
                      HomeTeam = m.a.HomeTeam,
                      OpponentTeam = m.a.OpponentTeam,
                      OpponentTeamId = m.a.OpponentTeamId,
                      Season = m.a.Season,
                      SeasonId = m.a.SeasonId,
                      Team = m.b,
                      TeamId = m.a.TeamId
                    })
                    .ToList();
      }

      return Json(Mapper.Map<IEnumerable<GameCompositeViewModel>>(results));
    }
  }
}
