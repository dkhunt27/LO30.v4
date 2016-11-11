using AutoMapper;
using LO30.Data;
using LO30.Web.ViewModels.Api;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace LO30.Web.Controllers.Api
{
  [Route("api/linestatseasons")]
  public class LineStatSeasonController : Controller
  {
    private LO30DbContext _context;

    public LineStatSeasonController(LO30DbContext context)
    {
      _context = context;
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="seasonId"></param>
    /// <param name="seasonTypeId"></param>
    /// <returns></returns>
    [HttpGet("seasons/{seasonId:int}/seasonTypes/{seasonTypeId:int}")]
    public JsonResult ListForSeasonIdSeasonTypeId(int seasonId, int seasonTypeId)
    {
      List<LineStatSeason> results;
      using (_context)
      {

        results = _context.LineStatSeasons
                          .Include(x => x.Team)
                          .Include(x => x.Season)
                          .Where(x => x.SeasonId == seasonId && x.Playoffs == Convert.ToBoolean(seasonTypeId))
                          .ToList();
      }

      return Json(Mapper.Map<IEnumerable<LineStatSeasonViewModel>>(results));
    }

    [HttpGet("teams/{teamId:int}/lines/{line:int}/seasons/{seasonId:int}")]
    public JsonResult ListForTeamIdLineSeasonId(int teamId, int line, int seasonId)
    {
      List<LineStatSeason> results;
      using (_context)
      {

        results = _context.LineStatSeasons
                          .Include(x => x.Team)
                          .Include(x => x.Season)
                          .Where(x => x.TeamId == teamId && x.Line == line && x.SeasonId == seasonId)
                          .ToList();
      }

      return Json(Mapper.Map<IEnumerable<LineStatSeasonViewModel>>(results));
    }

    [HttpGet("teams/{teamId:int}/seasons/{seasonId:int}")]
    public JsonResult ListForTeamIdSeasonId(int teamId, int seasonId)
    {
      List<LineStatSeason> results;
      using (_context)
      {

        results = _context.LineStatSeasons
                          .Include(x => x.Team)
                          .Include(x => x.Season)
                          .Where(x => x.TeamId == teamId && x.SeasonId == seasonId)
                          .ToList();
      }

      return Json(Mapper.Map<IEnumerable<LineStatSeasonViewModel>>(results));
    }

  }
}
