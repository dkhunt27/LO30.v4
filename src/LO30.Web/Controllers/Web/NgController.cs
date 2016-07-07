using LO30.Web.Models;
using LO30.Web.Services;
using Microsoft.AspNet.Mvc;
using Microsoft.Extensions.OptionsModel;

namespace LO30.Web.Controllers.Web
{
  public class NgController : Controller
  {
    private LO30DbContext _context;
    private CriteriaService _criteriaServices;
    private MySettings _mySettings { get; set; }

    public NgController(LO30DbContext context, CriteriaService criteriaServices, IOptions<MySettings> mySettings)
    {
      _context = context;
      _criteriaServices = criteriaServices;
      _mySettings = mySettings.Value;
    }

    public IActionResult Index()
    {
      ViewBag.SeasonId = _criteriaServices.SelectedSeasonId;
      ViewBag.SeasonName = _criteriaServices.SelectedSeasonName;
      ViewBag.SeasonTypeId = _criteriaServices.SelectedSeasonTypeId;
      ViewBag.SeasonTypeName = _criteriaServices.SelectedSeasonTypeName;

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
