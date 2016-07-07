using AutoMapper;
using LO30.Web.Models;
using LO30.Web.Models.Objects;
using LO30.Web.Services;
using LO30.Web.ViewModels.Api;
using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;

namespace LO30.Web.Controllers.Api
{
  [Route("api/teamstandings")]
  public class TeamStandingsController : Controller
  {
    private LO30DbContext _context;
    private CriteriaService _criteriaServices;

    public TeamStandingsController(LO30DbContext context, CriteriaService criteriaServices)
    {
      _context = context;
      _criteriaServices = criteriaServices;
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
