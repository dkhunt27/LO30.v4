﻿using System;
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
  [Route("api/playerstatteams")]
  public class PlayerStatTeamController : Controller
  {
    private LO30DbContext _context;

    public PlayerStatTeamController(LO30DbContext context)
    {
      _context = context;
    }

    // statsPlayer
    [HttpGet("seasons/{seasonId:int}/playoffs/{playoffs:bool}")]
    public JsonResult ListForSeasonIdPlayoffs(int seasonId, bool playoffs)
    {
      List<PlayerStatTeam> results;
      using (_context)
      {
        results = _context.PlayerStatTeams
                          .Include(x=>x.Team)
                          .Include(x=>x.Player)
                          .Where(x=>x.SeasonId == seasonId && x.Playoffs == playoffs)
                          .ToList();
      }

      return Json(Mapper.Map<IEnumerable<PlayerStatTeamViewModel>>(results));
    }

    // players (season tab)
    [HttpGet("players/{playerId:int}/seasons/{seasonId:int}")]
    public JsonResult ListForPlayerIdSeasonId(int playerId, int seasonId)
    {
      List<PlayerStatTeam> results;
      using (_context)
      {
        results = _context.PlayerStatTeams
                          .Include(x => x.Team)
                          .Include(x => x.Player)
                          .Where(x => x.SeasonId == seasonId && x.PlayerId == playerId)
                          .ToList();
      }

      return Json(Mapper.Map<IEnumerable<PlayerStatTeamViewModel>>(results));
    }
  }
}
