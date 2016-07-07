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
  [Route("api/playerstatgames")]
  public class PlayerStatGameController : Controller
  {
    private LO30DbContext _context;

    public PlayerStatGameController(LO30DbContext context)
    {
      _context = context;
    }

    // players (season tab)
    [HttpGet("players/{playerId:int}/seasons/{seasonId:int}")]
    public JsonResult ListForPlayerIdSeasonId(int playerId, int seasonId)
    {
      List<PlayerStatGame> results;
      using (_context)
      {
        results = _context.PlayerStatGames
                          .Include(x => x.Game)
                          .Include(x => x.Team)
                          .Include(x => x.Player)
                          .Where(x => x.SeasonId == seasonId && x.PlayerId == playerId)
                          .ToList();
      }

      return Json(Mapper.Map<IEnumerable<PlayerStatGameViewModel>>(results));
    }
  }
}
