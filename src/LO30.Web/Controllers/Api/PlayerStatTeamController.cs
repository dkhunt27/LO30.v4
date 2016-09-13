using AutoMapper;
using LO30.Data;
using LO30.Web.ViewModels.Api;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace LO30.Web.Controllers.Api
{
  [Route("api/playerstatteams")]
  public class PlayerStatTeamController : Controller
  {
    private LO30DbContext _context;

    public PlayerStatTeamController(LO30DbContext context)
    {
      _context = context;
    }

    // statsPlayer
    [HttpGet("seasons/{seasonId:int}/seasonTypes/{seasonTypeId:int}")]
    public JsonResult ListForSeasonIdSeasonTypeId(int seasonId, int seasonTypeId)
    {
      List<PlayerStatTeam> results;
      using (_context)
      {
        results = _context.PlayerStatTeams
                          .Include(x => x.Team)
                          .Include(x => x.Player)
                          .Where(x => x.SeasonId == seasonId && x.Playoffs == Convert.ToBoolean(seasonTypeId) && x.PlayerId > 0)
                          .ToList();
      }

      return Json(Mapper.Map<IEnumerable<PlayerStatTeamViewModel>>(results));
    }

    // players (season tab)
    [HttpGet("players/{playerId:int}/seasons/{seasonId:int}")]
    public JsonResult ListForPlayerIdSeasonId(int playerId, int seasonId)
    {
      List<PlayerStatTeam> results;
      using (_context)
      {
        results = _context.PlayerStatTeams
                          .Include(x => x.Team)
                          .Include(x => x.Player)
                          .Where(x => x.SeasonId == seasonId && x.PlayerId == playerId)
                          .ToList();
      }

      return Json(Mapper.Map<IEnumerable<PlayerStatTeamViewModel>>(results));
    }
  }
}
