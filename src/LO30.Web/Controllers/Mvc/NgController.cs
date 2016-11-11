using LO30.Data;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace LO30.Web.Controllers.Mvc
{
  public class NgController : Controller
  {
    private LO30DbContext _context;

    public NgController(LO30DbContext context)
    {
      _context = context;
    }

    public IActionResult Index()
    {
      return View();
    }

   /* public ActionResult ViewLoginModal()
    {
      return PartialView("_LoginModal");
    }

    [HttpPost]
    public ActionResult LoginModal()
    {
      return RedirectToAction("Index");
    }*/
  }
}
