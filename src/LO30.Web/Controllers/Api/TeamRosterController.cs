using AutoMapper;
using LO30.Data;
using LO30.Web.ViewModels.Api;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace LO30.Web.Controllers.Api
{
  [Route("api/teamrosters")]
  public class TeamRosterController : Controller
  {
    private LO30DbContext _context;

    public TeamRosterController(LO30DbContext context)
    {
      _context = context;
    }

    [HttpGet("teams/{teamId:int}")]
    public JsonResult listForTeamId(int teamId)
    {
      List<TeamRoster> results;
      using (_context)
      {
        results = _context.TeamRosters
                       .Where(x=>x.TeamId == teamId)
                       .Include(x => x.Team)
                       .Include(x => x.Season)
                       .Include(x => x.Player)
                       .ToList();
      }
      
      return Json(Mapper.Map<IEnumerable<TeamRosterViewModel>>(results));
    }
  }
}
