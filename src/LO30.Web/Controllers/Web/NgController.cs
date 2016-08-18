using LO30.Web.Models;
using LO30.Web.Services;
using Microsoft.AspNet.Mvc;
using Microsoft.Extensions.OptionsModel;

namespace LO30.Web.Controllers.Web
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
