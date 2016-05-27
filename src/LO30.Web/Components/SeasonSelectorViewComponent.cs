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
using LO30.Web.ViewModels.Components;
using LO30.Web.Services;

namespace LO30.Web.Components
{
  public class SeasonSelectorViewComponent : ViewComponent
  {
    private CriteriaService _criteriaService;

    public SeasonSelectorViewComponent(CriteriaService criteriaService)
    {
      _criteriaService = criteriaService;
    }

    public IViewComponentResult Invoke()
    {
      var vmSeasonSelectorList = new List<SeasonSelectorViewModel>();
      var vm = Mapper.Map<IEnumerable<SeasonSelectorViewModel>>(_criteriaService.Seasons)
                                        .Where(x=>x.SeasonId > 0)
                                        .ToList();

      vm.Where(w => w.SeasonId == _criteriaService.SelectedSeasonId).ToList().ForEach(s => s.IsSelected = true);
      return View(vm);
    }
  }
}
