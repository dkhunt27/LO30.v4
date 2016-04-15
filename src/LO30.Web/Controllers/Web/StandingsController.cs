using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;

namespace LO30.Web.Controllers
{
    public class StandingsController : Controller
    {
    public IActionResult RegularSeason()
    {

      ViewData["SubTitle"] = "Welcome in ASP.NET MVC 6 INSPINIA SeedProject ";
      ViewData["Message"] = "It is an application skeleton for a typical MVC 6 project. You can use it to quickly bootstrap your webapp projects.";

      return View();
    }

    public IActionResult Playoffs()
    {

      ViewData["SubTitle"] = "Welcome in ASP.NET MVC 6 INSPINIA SeedProject ";
      ViewData["Message"] = "It is an application skeleton for a typical MVC 6 project. You can use it to quickly bootstrap your webapp projects.";

      return View();
    }

  }
}
