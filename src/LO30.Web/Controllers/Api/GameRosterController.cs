using AutoMapper;
using LO30.Data;
using LO30.Web.ViewModels.Api;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace LO30.Web.Controllers.Api
{
  [Route("api/gamerosters")]
  public class GameRosterController : Controller
  {
    private LO30DbContext _context;

    public GameRosterController(LO30DbContext context)
    {
      _context = context;
    }

    [HttpGet("games/{gameId:int}")]
    public JsonResult ListByGameId(int gameId)
    {
      List<GameRoster> results;
      using (_context)
      {
        results = _context.GameRosters
                       .Where(x=>x.GameId == gameId)
                       .Include(x => x.Team)
                       .Include(x => x.Season)
                       .Include(x => x.Game)
                       .Include(x=>x.Player)
                       .Include(x=>x.SubbingForPlayer)
                       .ToList();
      }
      
      return Json(Mapper.Map<IEnumerable<GameRosterViewModel>>(results));
    }
  }
}
