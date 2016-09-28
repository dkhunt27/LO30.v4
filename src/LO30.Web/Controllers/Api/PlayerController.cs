using AutoMapper;
using LO30.Data;
using LO30.Web.ViewModels.Api;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace LO30.Web.Controllers.Api
{
  [Route("api/players")]
  public class PlayerController : Controller
  {
    private LO30DbContext _context;

    public PlayerController(LO30DbContext context)
    {
      _context = context;
    }

    [HttpGet("")]
    public JsonResult List()
    {
      List<Player> results;
      using (_context)
      {
        results = _context.Players.ToList();
      }

      return Json(Mapper.Map<IEnumerable<PlayerViewModel>>(results));
    }
  }
}
