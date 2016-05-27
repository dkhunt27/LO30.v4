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
  public class SeasonSelectedViewComponent : ViewComponent
  {
    private CriteriaService _criteriaService;

    public SeasonSelectedViewComponent(CriteriaService criteriaService)
    {
      _criteriaService = criteriaService;
    }

    public IViewComponentResult Invoke()
    {
      ViewBag.SelectedSeasonName = _criteriaService.SelectedSeasonName;

      return View();
    }
  }
}
