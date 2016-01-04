using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using LO30.Web.Models.Context;
using Microsoft.Data.Entity;
using DDay.iCal;
using DDay.iCal.Serialization;
using DDay.iCal.Serialization.iCalendar;
using LO30.Web.Models.Objects;

namespace LO30.Web.Controllers.Web
{
  [Route("[controller]")]
  public class ScheduleController : Controller
  {
    private LO30DbContext _context;

    public ScheduleController(LO30DbContext context)
    {
      _context = context;
    }

    public ActionResult Index()
    {
      return View();
    }

    [HttpGet("TeamFeed/Seasons/{seasonId:int}/Teams/{teamId:int}/{desc}")]
    public IActionResult TeamFeed(int seasonId, int teamId, string desc)
    {
      List<GameTeam> gameTeams = _context.GameTeams
                              .Include(x => x.Season)
                              .Include(x => x.Team)
                              .Include(x => x.OpponentTeam)
                              .Include(x => x.Game).ThenInclude(y => y.GameOutcomes)
                              .Include(x => x.Game).ThenInclude(y => y.GameScores)
                              .Where(x => x.SeasonId == seasonId && x.TeamId == teamId)
                              .ToList();

      // HACK, for some reason, the team was not getting "included"
      gameTeams = gameTeams.Join(_context.Teams,
                  a => a.TeamId,
                  b => b.TeamId,
                  (a, b) => new { a, b })
                  .Select(m => new GameTeam
                  {
                    Game = m.a.Game,
                    GameId = m.a.GameId,
                    HomeTeam = m.a.HomeTeam,
                    OpponentTeam = m.a.OpponentTeam,
                    OpponentTeamId = m.a.OpponentTeamId,
                    Season = m.a.Season,
                    SeasonId = m.a.SeasonId,
                    Team = m.b,
                    TeamId = m.a.TeamId
                  })
                  .ToList();

      iCalendar ical = new iCalendar();
      foreach (var gameTeam in gameTeams)
      {
        Event icalEvent = ical.Create<Event>();

        var summary = gameTeam.OpponentTeam.TeamNameShort + " vs " + gameTeam.Team.TeamNameShort;
        if (gameTeam.HomeTeam)
        {
          summary = gameTeam.Team.TeamNameShort + " vs " + gameTeam.OpponentTeam.TeamNameShort;
        }

        icalEvent.Summary = summary;
        icalEvent.Description = summary + " " + gameTeam.Game.Location;

        var year = gameTeam.Game.GameDateTime.Year;
        var mon = gameTeam.Game.GameDateTime.Month;
        var day = gameTeam.Game.GameDateTime.Day;
        var hr = gameTeam.Game.GameDateTime.Hour;
        var min = gameTeam.Game.GameDateTime.Minute;
        var sec = gameTeam.Game.GameDateTime.Second;
        icalEvent.Start = new iCalDateTime(gameTeam.Game.GameDateTime);
        icalEvent.Duration = TimeSpan.FromHours(1.25);
        icalEvent.Location = "Eddie Edgar " + gameTeam.Game.Location;
      }

      ISerializationContext ctx = new SerializationContext();
      ISerializerFactory factory = new SerializerFactory();
      IStringSerializer serializer = factory.Build(ical.GetType(), ctx) as IStringSerializer;

      string output = serializer.SerializeToString(ical);
      var contentType = "text/calendar";

      return Content(output, contentType);
    }
  }
}
