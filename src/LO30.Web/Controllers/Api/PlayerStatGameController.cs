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
  [Route("api/playerstatgames")]
  public class PlayerStatGameController : Controller
  {
    private LO30DbContext _context;

    public PlayerStatGameController(LO30DbContext context)
    {
      _context = context;
    }

    // players (season tab)
    [HttpGet("players/{playerId:int}/seasons/{seasonId:int}")]
    public JsonResult ListForPlayerIdSeasonId(int playerId, int seasonId)
    {
      List<PlayerStatGame> results;
      using (_context)
      {
        results = _context.PlayerStatGames
                          .Include(x => x.Game)
                          .Include(x => x.Team)
                          .Include(x => x.Player)
                          .Where(x => x.SeasonId == seasonId && x.PlayerId == playerId)
                          .ToList();
      }

      return Json(Mapper.Map<IEnumerable<PlayerStatGameViewModel>>(results));
    }
  }
}
