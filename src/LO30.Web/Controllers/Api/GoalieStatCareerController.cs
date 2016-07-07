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
  [Route("api/goaliestatcareers")]
  public class GoalieStatCareerController : Controller
  {
    private LO30DbContext _context;

    public GoalieStatCareerController(LO30DbContext context)
    {
      _context = context;
    }

    [HttpGet()]
    public JsonResult List()
    {
      List<GoalieStatCareer> results;
      using (_context)
      {
        results = _context.GoalieStatCareers
                          .Include(x => x.Player)
                          .ToList();
      }

      return Json(Mapper.Map<IEnumerable<GoalieStatCareerViewModel>>(results));
    }

    [HttpGet("players/{playerId:int}")]
    public JsonResult GetForPlayerId(int playerId)
    {
      GoalieStatCareer results;
      using (_context)
      {
        results = _context.GoalieStatCareers
                          .Include(x=>x.Player)
                          .Where(x=>x.PlayerId == playerId)
                          .SingleOrDefault();
      }

      return Json(Mapper.Map<GoalieStatCareerViewModel>(results));
    }
  }
}
