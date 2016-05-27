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
  public class HomeController : Controller
  {
    private CriteriaService _criteriaService;

    public HomeController(CriteriaService criteriaService)
    {
      _criteriaService = criteriaService;
    }

    public IActionResult Index()
    {
      ViewData["SubTitle"] = "Welcome in ASP.NET MVC 6 INSPINIA SeedProject ";
      ViewData["Message"] = "It is an application skeleton for a typical MVC 6 project. You can use it to quickly bootstrap your webapp projects.";

      return View(_criteriaService.Decades);
    }

    public IActionResult Minor()
    {

      ViewData["SubTitle"] = "Simple example of second view";
      ViewData["Message"] = "Data are passing to view by ViewData from controller";

      return View();
    }

    public IActionResult CriteriaUpdate(int selectedSeasonId, string path, string queryString)
    {
      _criteriaService.SetSelectedSeasonById(selectedSeasonId);

      var returnUrl = path;

      if (!string.IsNullOrWhiteSpace(queryString))
      {
        returnUrl = returnUrl + queryString;
      }

      return Redirect(returnUrl);
    }


    private IActionResult RedirectToLocal(string returnUrl)
    {
      if (Url.IsLocalUrl(returnUrl))
      {
        return Redirect(returnUrl);
      }
      else
      {
        return RedirectToAction(nameof(HomeController.Index), "Home");
      }
    }
  }
}
