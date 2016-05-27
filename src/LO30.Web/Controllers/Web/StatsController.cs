using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using LO30.Web.Models;
using LO30.Web.Models.Objects;
using LO30.Web.ViewModels.Api;
using AutoMapper;
using Microsoft.Data.Entity;
using Microsoft.AspNet.Http;
using LO30.Web.Services;

namespace LO30.Web.Controllers.Web
{
  public class StatsController : Controller
  {
    private LO30DbContext _context;
    private CriteriaService _criteriaServices;
    private PlayerNameService _playerNameServices;

    public StatsController(LO30DbContext context, CriteriaService criteriaServices, PlayerNameService playerNameServices)
    {
      _context = context;
      _criteriaServices = criteriaServices;
      _playerNameServices = playerNameServices;
    }

    public IActionResult Index(bool playoffs)
    {
      ViewData["SeasonId"] = _criteriaServices.SelectedSeasonId;
      ViewData["Playoffs"] = playoffs;
      ViewData["SeasonName"] = _criteriaServices.SelectedSeasonName;
      ViewData["SeasonType"] = playoffs ? "Playoffs" : "Regular Season";

      List<PlayerStatTeam> results;
      using (_context)
      {
        results = _context.PlayerStatTeams
                          .Include(x => x.Season)
                          .Include(x => x.Team)
                          .Include(x => x.Player)
                          .Where(x => x.SeasonId == _criteriaServices.SelectedSeasonId && x.Playoffs == playoffs && x.PlayerId > 0)
                          .ToList();
      }

      var vm = Mapper.Map<IEnumerable<PlayerStatTeamViewModel>>(results);

      vm.ToList().ForEach(s => s.PlayerNameCode = _playerNameServices.BuildPlayerNameCode(s.PlayerFirstName, s.PlayerLastName, s.PlayerSuffix));
      vm.ToList().ForEach(s => s.PlayerNameShort = _playerNameServices.BuildPlayerNameShort(s.PlayerFirstName, s.PlayerLastName, s.PlayerSuffix));
      vm.ToList().ForEach(s => s.PlayerNameLong = _playerNameServices.BuildPlayerNameLong(s.PlayerFirstName, s.PlayerLastName, s.PlayerSuffix));

      return View(vm);
    }

  }
}
