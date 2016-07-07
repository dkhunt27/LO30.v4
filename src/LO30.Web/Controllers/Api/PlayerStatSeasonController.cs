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
  [Route("api/playerstatseasons")]
  public class PlayerStatSeasonController : Controller
  {
    private LO30DbContext _context;

    public PlayerStatSeasonController(LO30DbContext context)
    {
      _context = context;
    }

    [HttpGet("players/{playerId:int}")]
    public JsonResult ListForPlayerId(int playerId)
    {
      List<PlayerStatSeasonNoPlayoffs> results;
      using (_context)
      {

        // TODO, the includes don't seem to work with the group by...more work/research needed
        //results = _context.PlayerStatSeasons
        //                  .Include(x => x.Player)
        //                  .Include(x => x.Season)
        //                  .Where(x => x.PlayerId == playerId)
        //                  .GroupBy(x => new { x.PlayerId, x.Player, x.SeasonId, x.Season })
        //                  .Select(grp => new PlayerStatSeason
        //                  {
        //                    PlayerId = grp.Key.PlayerId,
        //                    Player = grp.Key.Player,
        //                    SeasonId = grp.Key.SeasonId,
        //                    Season = grp.Key.Season,
        //                    Playoffs = false,               // although this doesn't matter
        //                    Games = grp.Sum(x => x.Games),
        //                    Goals = grp.Sum(x => x.Goals),
        //                    Assists = grp.Sum(x => x.Assists),
        //                    Points = grp.Sum(x => x.Points),
        //                    PenaltyMinutes = grp.Sum(x => x.PenaltyMinutes),
        //                    PowerPlayGoals = grp.Sum(x => x.PowerPlayGoals),
        //                    ShortHandedGoals = grp.Sum(x => x.ShortHandedGoals),
        //                    GameWinningGoals = grp.Sum(x => x.GameWinningGoals)
        //                  })
        //                .ToList();

        var tempResults = _context.PlayerStatSeasons
                          .Include(x => x.Player)
                          .Include(x => x.Season)
                          .Where(x => x.PlayerId == playerId)
                          .ToList();

        results = tempResults
                          .GroupBy(x => new { x.PlayerId, x.Player, x.SeasonId, x.Season })
                          .Select(grp => new PlayerStatSeasonNoPlayoffs
                          {
                            PlayerId = grp.Key.PlayerId,
                            Player = grp.Key.Player,
                            SeasonId = grp.Key.SeasonId,
                            Season = grp.Key.Season,
                            Games = grp.Sum(x => x.Games),
                            Goals = grp.Sum(x => x.Goals),
                            Assists = grp.Sum(x => x.Assists),
                            Points = grp.Sum(x => x.Points),
                            PenaltyMinutes = grp.Sum(x => x.PenaltyMinutes),
                            PowerPlayGoals = grp.Sum(x => x.PowerPlayGoals),
                            ShortHandedGoals = grp.Sum(x => x.ShortHandedGoals),
                            GameWinningGoals = grp.Sum(x => x.GameWinningGoals)
                          })
                        .ToList();
      }

      return Json(Mapper.Map<IEnumerable<PlayerStatSeasonNoPlayoffsViewModel>>(results));
    }

  }
}
