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
  [Route("api/linestatteams")]
  public class LineStatTeamController : Controller
  {
    private LO30DbContext _context;

    public LineStatTeamController(LO30DbContext context)
    {
      _context = context;
    }

    [HttpGet("seasons/{seasonId:int}/seasonTypes/{seasonTypeId:int}")]
    public JsonResult ListForSeasonIdSeasonTypeId(int seasonId, int seasonTypeId)
    {
      List<LineStatTeam> results;
      using (_context)
      {
        results = _context.LineStatTeams
                          .Include(x=>x.Team)
                          .Include(x=>x.OpponentTeam)
                          .Where(x=>x.SeasonId == seasonId && x.Playoffs == Convert.ToBoolean(seasonTypeId))
                          .ToList();
      }

      return Json(Mapper.Map<IEnumerable<LineStatTeamViewModel>>(results));
    }

    [HttpGet("teams/{teamId:int}/lines/{line:int}/seasons/{seasonId:int}")]
    public JsonResult ListForTeamIdLineSeasonId(int teamId, int line, int seasonId)
    {
      List<LineStatTeam> results;
      using (_context)
      {
        results = _context.LineStatTeams
                          .Include(x => x.Team)
                          .Include(x => x.OpponentTeam)
                          .Where(x => x.SeasonId == seasonId && x.TeamId == teamId && x.Line == line)
                          .ToList();
      }

      return Json(Mapper.Map<IEnumerable<LineStatTeamViewModel>>(results));
    }

    [HttpGet("teams/{teamId:int}/seasons/{seasonId:int}")]
    public JsonResult ListForTeamIdSeasonId(int teamId, int seasonId)
    {
      List<LineStatTeam> results;
      using (_context)
      {
        results = _context.LineStatTeams
                          .Include(x => x.Team)
                          .Include(x => x.OpponentTeam)
                          .Where(x => x.SeasonId == seasonId && x.TeamId == teamId)
                          .ToList();
      }

      return Json(Mapper.Map<IEnumerable<LineStatTeamViewModel>>(results));
    }
  }
}
