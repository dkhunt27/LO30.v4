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
  public class StandingsController : Controller
  {
    private LO30DbContext _context;
    private CriteriaService _criteriaServices;

    public StandingsController(LO30DbContext context, CriteriaService criteriaServices)
    {
      _context = context;
      _criteriaServices = criteriaServices;
    }

    public IActionResult Index(bool playoffs)
    {
      ViewData["SeasonId"] = _criteriaServices.SelectedSeasonId;
      ViewData["Playoffs"] = playoffs;
      ViewData["SeasonName"] = _criteriaServices.SelectedSeasonName;
      ViewData["SeasonType"] = playoffs ? "Playoffs" : "Regular Season";

      return View();
    }

  }
}
