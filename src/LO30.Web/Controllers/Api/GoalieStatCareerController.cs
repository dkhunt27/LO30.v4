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
  [Route("api/goaliestatcareers")]
  public class GoalieStatCareerController : Controller
  {
    private LO30DbContext _context;

    public GoalieStatCareerController(LO30DbContext context)
    {
      _context = context;
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
