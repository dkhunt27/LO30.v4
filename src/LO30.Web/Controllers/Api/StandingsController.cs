using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using LO30.Web.Models;
using LO30.Web.Models.Objects;
using LO30.Web.ViewModels.Api;
using AutoMapper;
using Microsoft.Data.Entity;
using Microsoft.AspNet.Http;
using LO30.Web.Services;

namespace LO30.Web.Controllers.Api
{
  [Route("api/standings")]
  public class StandingsController : Controller
  {
    private LO30DbContext _context;
    private CriteriaService _criteriaServices;

    public StandingsController(LO30DbContext context, CriteriaService criteriaServices)
    {
      _context = context;
      _criteriaServices = criteriaServices;
    }

    [HttpGet("playoffs/{playoffs:bool}")]
    public JsonResult ListForPlayoffs(bool playoffs)
    {
      return ListForSeasonIdPlayoffs(_criteriaServices.SelectedSeasonId, playoffs);
    }

    [HttpGet("seasons/{seasonId:int}/playoffs/{playoffs:bool}")]
    public JsonResult ListForSeasonIdPlayoffs(int seasonId, bool playoffs)
    {
      List<TeamStanding> results;
      using (_context)
      {
        results = _context.TeamStandings
                          .Include(x => x.Season)
                          .Include(x => x.Team).ThenInclude(x => x.Division)
                          .Where(x => x.SeasonId == seasonId && x.Playoffs == playoffs)
                          .ToList();
      }

      return Json(Mapper.Map<IEnumerable<TeamStandingViewModel>>(results));
    }

  }
}
