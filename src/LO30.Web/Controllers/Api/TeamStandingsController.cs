using AutoMapper;
using LO30.Data;
using LO30.Web.Services;
using LO30.Web.ViewModels.Api;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace LO30.Web.Controllers.Api
{
  [Route("api/teamstandings")]
  public class TeamStandingsController : Controller
  {
    private LO30DbContext _context;

    public TeamStandingsController(LO30DbContext context)
    {
      _context = context;
    }

    //[HttpGet("seasonTypes/{seasonTypeId:int}")]
    //public JsonResult ListForSeasonTypeId(int seasonTypeId)
    //{
    //  return ListForSeasonIdSeasonTypeId(_criteriaServices.SelectedSeasonId, seasonTypeId);
    //}

    [HttpGet("seasons/{seasonId:int}/seasonTypes/{seasonTypeId:int}")]
    public JsonResult ListForSeasonIdSeasonTypeId(int seasonId, int seasonTypeId)
    {
      List<TeamStanding> results;
      using (_context)
      {
        results = _context.TeamStandings
                          .Include(x => x.Season)
                          .Include(x => x.Team).ThenInclude(x => x.Division)
                          .Where(x => x.SeasonId == seasonId && x.Playoffs == Convert.ToBoolean(seasonTypeId))
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
                          .Include(x => x.Season)
                          .Include(x => x.Team).ThenInclude(x => x.Division)
                          .Where(x => x.SeasonId == seasonId && x.TeamId == teamId)
                          .ToList();
      }

      return Json(Mapper.Map<IEnumerable<TeamStandingViewModel>>(results));
    }

  }
}
