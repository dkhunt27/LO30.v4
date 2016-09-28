using AutoMapper;
using LO30.Data;
using LO30.Web.ViewModels.Api;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace LO30.Web.Controllers.Api
{
  [Route("api/scoresheetentries/processed/subs")]
  public class ScoreSheetEntryProcessedSubController : Controller
  {
    private LO30DbContext _context;

    public ScoreSheetEntryProcessedSubController(LO30DbContext context)
    {
      _context = context;
    }

    // boxscore scoring details
    [HttpGet("games/{gameId:int}")]
    public JsonResult ListForGameId(int gameId)
    {
      List<ScoreSheetEntryProcessedSub> results;
      using (_context)
      {
        results = _context.ScoreSheetEntryProcessedSubs
                          .Include(x=>x.Team)
                          .Include(x=>x.SubPlayer)
                          .Include(x=>x.SubbingForPlayer)
                          .Where(x=>x.GameId == gameId)
                          .ToList();
      }

      return Json(Mapper.Map<IEnumerable<ScoreSheetEntryProcessedSubViewModel>>(results));
    }
  }
}
