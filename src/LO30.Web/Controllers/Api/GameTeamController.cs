using AutoMapper;
using LO30.Data;
using LO30.Web.ViewModels.Api;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace LO30.Web.Controllers.Api
{
  [Route("api/gameteams")]
  public class GameTeamController : Controller
  {
    private LO30DbContext _context;

    public GameTeamController(LO30DbContext context)
    {
      _context = context;
    }

    [HttpGet("games/{gameId:int}")]
    public JsonResult ListByGameId(int gameId)
    {
      List<GameTeam> results;
      using (_context)
      {
        results = _context.GameTeams
                       .Where(x=>x.GameId == gameId)
                       .Include(x=>x.Team)
                       .Include(x=>x.Season)
                       .Include(x=>x.OpponentTeam)
                       .Include(x=>x.Game)
                       .ToList();
      }
      
      return Json(Mapper.Map<IEnumerable<GameTeamViewModel>>(results));
    }
  }
}
