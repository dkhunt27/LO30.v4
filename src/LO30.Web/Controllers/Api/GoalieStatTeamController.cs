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
  [Route("api/goaliestatteams")]
  public class GoalieStatTeamController : Controller
  {
    private LO30DbContext _context;

    public GoalieStatTeamController(LO30DbContext context)
    {
      _context = context;
    }

    // statsPlayer
    [HttpGet("seasons/{seasonId:int}/seasonTypes/{seasonTypeId:int}")]
    public JsonResult ListForSeasonIdSeasonTypeId(int seasonId, int seasonTypeId)
    {
      List<GoalieStatTeam> results;
      using (_context)
      {
        results = _context.GoalieStatTeams
                          .Include(x=>x.Team)
                          .Include(x=>x.Player)
                          .Where(x=>x.SeasonId == seasonId && x.Playoffs == Convert.ToBoolean(seasonTypeId))
                          .ToList();
      }

      return Json(Mapper.Map<IEnumerable<GoalieStatTeamViewModel>>(results));
    }

    // players (season tab)
    [HttpGet("players/{playerId:int}/seasons/{seasonId:int}")]
    public JsonResult ListForPlayerIdSeasonId(int playerId, int seasonId)
    {
      List<GoalieStatTeam> results;
      using (_context)
      {
        results = _context.GoalieStatTeams
                          .Include(x => x.Team)
                          .Include(x => x.Player)
                          .Where(x => x.SeasonId == seasonId && x.PlayerId == playerId)
                          .ToList();
      }

      return Json(Mapper.Map<IEnumerable<GoalieStatTeamViewModel>>(results));
    }
  }
}
