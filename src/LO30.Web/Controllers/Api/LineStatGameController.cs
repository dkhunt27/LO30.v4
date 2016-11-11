using AutoMapper;
using LO30.Data;
using LO30.Web.ViewModels.Api;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace LO30.Web.Controllers.Api
{
  [Route("api/linestatgames")]
  public class LineStatGameController : Controller
  {
    private LO30DbContext _context;

    public LineStatGameController(LO30DbContext context)
    {
      _context = context;
    }

    [HttpGet("teams/{teamId:int}/lines/{line:int}/seasons/{seasonId:int}")]
    public JsonResult ListForTeamIdLineSeasonId(int teamId, int line, int seasonId)
    {
      List<LineStatGame> results;
      using (_context)
      {
        results = _context.LineStatGames
                          .Include(x => x.Game)
                          .Include(x => x.Team)
                          .Include(x => x.OpponentTeam)
                          .Where(x => x.SeasonId == seasonId && x.TeamId == teamId && x.Line == line)
                          .ToList();
      }

      return Json(Mapper.Map<IEnumerable<LineStatGameViewModel>>(results));
    }

    // box score scoring detail
    [HttpGet("games/{gameId:int}")]
    public JsonResult ListForGameId(int gameId)
    {
      List<LineStatGame> results;
      using (_context)
      {
        results = _context.LineStatGames
                          .Include(x => x.Game)
                          .Include(x => x.Team)
                          .Include(x => x.OpponentTeam)
                          .Where(x => x.GameId == gameId)
                          .ToList();
      }

      return Json(Mapper.Map<IEnumerable<LineStatGameViewModel>>(results));
    }
  }
}
