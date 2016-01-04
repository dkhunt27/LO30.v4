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
  [Route("api/teamstandings")]
  public class TeamStandingController : Controller
  {
    private LO30DbContext _context;

    public TeamStandingController(LO30DbContext context)
    {
      _context = context;
    }

    [HttpGet("seasons/{seasonId:int}/playoffs/{playoffs:bool}")]
    public JsonResult ListForSeasonIdPlayoffs(int seasonId, bool playoffs)
    {
      List<TeamStanding> results;
      using (_context)
      {
        results = _context.TeamStandings
                          .Include(x=>x.Team)
                          .ThenInclude(x=>x.Division)
                          .Where(x=>x.SeasonId == seasonId && x.Playoffs == playoffs)
                          .ToList();
      }

      return Json(Mapper.Map<IEnumerable<TeamStandingViewModel>>(results));
    }

    [HttpGet("seasons/{seasonId:int}/teams/{teamId:int}")]
    public JsonResult ListForSeasonIdTeamId(int seasonId, int teamId)
    {
      List<TeamStanding> results;
      using (_context)
      {
        results = _context.TeamStandings
                          .Include(x => x.Team)
                          .ThenInclude(x => x.Division)
                          .Where(x => x.SeasonId == seasonId && x.TeamId == teamId)
                          .ToList();
      }

      return Json(Mapper.Map<IEnumerable<TeamStandingViewModel>>(results));
    }
  }
}
