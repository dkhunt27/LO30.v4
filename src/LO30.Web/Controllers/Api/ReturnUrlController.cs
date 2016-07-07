using LO30.Web.Models;
using LO30.Web.Models.Objects;
using LO30.Web.ViewModels.Api;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using System.Collections.Generic;
using System.Linq;

namespace LO30.Web.Controllers.Api
{
  [Route("api/returnurl")]
  public class ReturnUrlController : Controller
  {
    private LO30DbContext _context;

    public ReturnUrlController(LO30DbContext context)
    {
      _context = context;
    }

    [HttpPost]
    public JsonResult GetLastGameProcessedForSeasonId([FromBody] ReturnUrlViewModel vm)
    {
      HttpContext.Session.SetString("ReturnUrl", vm.ReturnUrl);

      return Json(vm);
    }
  }
}
