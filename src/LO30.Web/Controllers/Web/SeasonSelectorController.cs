using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using LO30.Web.Models;
using LO30.Web.Services;
using LO30.Web.ViewModels.Components;
using AutoMapper;
using LO30.Web.ViewModels.Api;

namespace LO30.Web.Controllers.Web
{
  public class SeasonSelectorController : Controller
  {
    private CriteriaService _criteriaService;

    public SeasonSelectorController(CriteriaService criteriaService)
    {
      _criteriaService = criteriaService;
    }

    public IActionResult Index()
    {
      var vmSeasonSelectorList = new List<SeasonSelectorViewModel>();
      var vm = Mapper.Map<IEnumerable<SeasonSelectorViewModel>>(_criteriaService.Seasons)
                                        .Where(x => x.SeasonId > 0)
                                        .ToList();

      vm.Where(w => w.SeasonId == _criteriaService.SelectedSeasonId).ToList().ForEach(s => s.IsSelected = true);
      return View(vm);
    }
  }
}
