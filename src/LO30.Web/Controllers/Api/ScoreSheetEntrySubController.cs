﻿using AutoMapper;
using LO30.Data;
using LO30.Web.ViewModels.Api;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace LO30.Web.Controllers.Api
{
  [Route("api/scoresheetentries/subs")]
  public class ScoreSheetEntrySubController : Controller
  {
    private LO30DbContext _context;

    public ScoreSheetEntrySubController(LO30DbContext context)
    {
      _context = context;
    }

    // boxscore scoring details
    [HttpGet("games/{gameId:int}")]
    public JsonResult ListForGameId(int gameId)
    {
      List<ScoreSheetEntrySub> results;
      using (_context)
      {
        results = _context.ScoreSheetEntrySubs
                          .Where(x=>x.GameId == gameId)
                          .ToList();
      }

      return Json(Mapper.Map<IEnumerable<ScoreSheetEntrySubViewModel>>(results));
    }
  }
}