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
  [Route("api/playerstatcareers")]
  public class PlayerStatCareerController : Controller
  {
    private LO30DbContext _context;

    public PlayerStatCareerController(LO30DbContext context)
    {
      _context = context;
    }

    [HttpGet("players/{playerId:int}")]
    public JsonResult GetPlayerStatCareerForPlayerId(int playerId)
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
