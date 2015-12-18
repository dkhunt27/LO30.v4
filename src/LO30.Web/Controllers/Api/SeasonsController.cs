using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;

namespace LO30.Web.Controllers.Api
{
    public class SeasonsController : Controller
    {
        public JsonResult Index()
        {
            return Json(true);
        }
    }
}
