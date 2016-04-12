using System.Linq;
using Microsoft.AspNet.Mvc;
using Microsoft.AspNet.Mvc.Rendering;
using Microsoft.Data.Entity;
using LO30.Web.Models.Context;
using LO30.Web.Models.Objects;
using System;

namespace LO30.Web.Controllers.Web
{
  public class PlayersController : Controller
  {
    private LO30DbContext _context;

    public PlayersController(LO30DbContext context)
    {
      _context = context;
    }

    // GET: Players
    public IActionResult Index(string sortOrder)
    {
      var results = _context.Players.ToList();

      // initial sort order
      ViewBag.FirstNameSortParm = "firstname_asc";
      ViewBag.LastNameSortParm = "lastname_desc";

      switch (sortOrder)
      {
        case "firstname_asc":
          results = results.OrderBy(s => s.FirstName).ToList();
          ViewBag.FirstNameSortParm = "firstname_desc";
          break;
        case "firstname_desc":
          results = results.OrderByDescending(s => s.FirstName).ToList();
          ViewBag.FirstNameSortParm = "firstname_asc";
          break;
        case "lastname_asc":
          results = results.OrderBy(s => s.LastName).ToList();
          ViewBag.LastNameSortParm = "lastname_desc";
          break;
        case "lastname_desc":
          results = results.OrderByDescending(s => s.LastName).ToList();
          ViewBag.LastNameSortParm = "lastname_asc";
          break;
        default:
          results = results.OrderBy(s => s.FirstName).ToList();
          ViewBag.FirstNameSortParm = "firstname_desc";
          break;
      }
      return View(results.ToList());
    }

    // GET: Players/Details/5
    public IActionResult Details(int? id)
    {
      if (id == null)
      {
        return HttpNotFound();
      }

      Player player = _context.Players.Single(m => m.PlayerId == id);
      if (player == null)
      {
        return HttpNotFound();
      }

      return View(player);
    }

    // GET: Players/Create
    public IActionResult Create()
    {
      return View();
    }

    // POST: Players/Create
    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult Create(Player player)
    {
      if (ModelState.IsValid)
      {
        _context.Players.Add(player);
        _context.SaveChanges();
        return RedirectToAction("Index");
      }
      return View(player);
    }

    // GET: Players/Edit/5
    public IActionResult Edit(int? id)
    {
      if (id == null)
      {
        return HttpNotFound();
      }

      Player player = _context.Players.Single(m => m.PlayerId == id);
      if (player == null)
      {
        return HttpNotFound();
      }
      return View(player);
    }

    // POST: Players/Edit/5
    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult Edit(Player player)
    {
      if (ModelState.IsValid)
      {
        _context.Update(player);
        _context.SaveChanges();
        return RedirectToAction("Index");
      }
      return View(player);
    }

    // GET: Players/Delete/5
    [ActionName("Delete")]
    public IActionResult Delete(int? id)
    {
      if (id == null)
      {
        return HttpNotFound();
      }

      Player player = _context.Players.Single(m => m.PlayerId == id);
      if (player == null)
      {
        return HttpNotFound();
      }

      return View(player);
    }

    // POST: Players/Delete/5
    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public IActionResult DeleteConfirmed(int id)
    {
      Player player = _context.Players.Single(m => m.PlayerId == id);
      _context.Players.Remove(player);
      _context.SaveChanges();
      return RedirectToAction("Index");
    }
  }
}
