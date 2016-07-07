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
  public class SeasonTypeSelectorViewComponent : ViewComponent
  {
    private CriteriaService _criteriaService;

    public SeasonTypeSelectorViewComponent(CriteriaService criteriaService)
    {
      _criteriaService = criteriaService;
    }

    public IViewComponentResult Invoke()
    {
      var vmSeasonTypeSelectorList = new List<SeasonTypeSelectorViewModel>();
      var vm = Mapper.Map<IEnumerable<SeasonTypeSelectorViewModel>>(_criteriaService.SeasonTypes).ToList();
      vm.Where(w => w.SeasonTypeId == _criteriaService.SelectedSeasonTypeId).ToList().ForEach(s => s.IsSelected = true);
      return View(vm);
    }
  }
}
