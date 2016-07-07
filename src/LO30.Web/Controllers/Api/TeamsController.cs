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
  [Route("api/teams")]
  public class TeamsController : Controller
  {
    private LO30DbContext _context;

    public TeamsController(LO30DbContext context)
    {
      _context = context;
    }

    [HttpGet("seasons/{seasonId:int}")]
    public JsonResult ListForSeasonId(int seasonId)
    {
      List<Team> results;
      using (_context)
      {
        results = _context.Teams
                          .Include(x => x.Season)
                          .Include(x => x.Division)
                          .Where(x=>x.SeasonId == seasonId)
                          .ToList();
      }

      return Json(Mapper.Map<IEnumerable<TeamViewModel>>(results));
    }
  }
}
