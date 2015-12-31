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
  [Route("api/scoresheetentries/processed/goals")]
  public class ScoreSheetEntryProcessedGoalController : Controller
  {
    private LO30DbContext _context;

    public ScoreSheetEntryProcessedGoalController(LO30DbContext context)
    {
      _context = context;
    }

    // boxscore scoring details
    [HttpGet("games/{gameId:int}")]
    public JsonResult ListForGameId(int gameId)
    {
      List<ScoreSheetEntryProcessedGoal> results;
      using (_context)
      {
        results = _context.ScoreSheetEntryProcessedGoals
                          .Include(x=>x.Team)
                          .Include(x=>x.GoalPlayer)
                          .Include(x=>x.Assist1Player)
                          .Include(x=>x.Assist2Player)
                          .Include(x=>x.Assist3Player)
                          .Where(x=>x.GameId == gameId)
                          .ToList();
      }

      return Json(Mapper.Map<IEnumerable<ScoreSheetEntryProcessedGoalViewModel>>(results));
    }
  }
}
