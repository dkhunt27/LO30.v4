using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using LO30.Web.Models.Context;
using LO30.Web.Models.Objects;
using Microsoft.Data.Entity;

namespace LO30.Web.Controllers.Api
{
  [Route("api/playerStatGames")]
  public class PlayerStatGamesController : Controller
  {
    public PlayerStatGamesController()
    {
    }
  }
}
