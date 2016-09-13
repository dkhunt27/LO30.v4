using AutoMapper;
using LO30.Data;
using LO30.Web.ViewModels.Api;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace LO30.Web.Controllers.Api
{
  [Route("api/playerstatcareers")]
  public class PlayerStatCareerController : Controller
  {
    private LO30DbContext _context;

    public PlayerStatCareerController(LO30DbContext context)
    {
      _context = context;
    }

    [HttpGet()]
    public JsonResult List()
    {
      List<PlayerStatCareer> results;
      using (_context)
      {
        results = _context.PlayerStatCareers
                          .Include(x => x.Player)
                          .ToList();
      }

      return Json(Mapper.Map<IEnumerable<PlayerStatCareerViewModel>>(results));
    }

    [HttpGet("players/{playerId:int}")]
    public JsonResult GetForPlayerId(int playerId)
    {
      PlayerStatCareer results;
      using (_context)
      {
        results = _context.PlayerStatCareers
                          .Include(x=>x.Player)
                          .Where(x=>x.PlayerId == playerId)
                          .SingleOrDefault();
      }

      return Json(Mapper.Map<PlayerStatCareerViewModel>(results));
    }
  }
}
