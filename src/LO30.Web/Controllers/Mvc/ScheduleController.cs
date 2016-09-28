using DDay.iCal;
using DDay.iCal.Serialization;
using DDay.iCal.Serialization.iCalendar;
using LO30.Data;
using LO30.Web.ViewModels.Schedule;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace LO30.Web.Controllers.Mvc
{
  public class ScheduleController : Controller
  {
    LO30DbContext _context;
    public ScheduleController(LO30DbContext context)
    {
      _context = context;
    }

    public ActionResult Index()
    {
      var seasonId = _context.Seasons.Where(x => x.IsCurrentSeason == true).Single().SeasonId;
      var seasonName = _context.Seasons.Where(x => x.SeasonId == seasonId).Single().SeasonName;

      var teams = _context.Teams.Where(x => x.SeasonId == seasonId).ToList();

      ViewData["SeasonId"] = seasonId;
      ViewData["SeasonName"] = seasonName;

      List<TeamFeedViewModel> teamFeeds = new List<TeamFeedViewModel>();

      var hostingEnvironment = Environment.GetEnvironmentVariable("Hosting:Environment");

      string baseUrl;

#if DEBUG
      baseUrl = "localhost:8080";
#else
      baseUrl = "lo30.azurewebsites.net";
#endif

      foreach (var team in teams)
      {
        var teamId = team.TeamId;
        var scheduleTeamName = team.TeamNameLong.Replace(" ", "").Replace("/", "").Replace("-", "").Replace(".", "").Replace("&", "").Replace("'", "");
        var scheduleSeasonName = seasonName.Replace(" ", "");

        var teamFeed = new TeamFeedViewModel()
        {
          TeamCode = team.TeamCode,
          TeamNameLong = team.TeamNameLong,
          TeamNameShort = team.TeamNameShort,
          TeamFeedUrl = baseUrl + "/Schedule/TeamFeed/Seasons/" + seasonId + "/Teams/" + teamId + "/LO30Schedule-" + scheduleTeamName + "-" + scheduleSeasonName
        };

        teamFeeds.Add(teamFeed);
      }

      return View(teamFeeds);
    }

    public ActionResult TeamFeed(int seasonId, int teamId, string desc)
    {

      var seasonName = _context.Seasons.Where(x => x.SeasonId == seasonId).Single().SeasonName;
      var teamName = _context.Teams.Where(x => x.TeamId == teamId).Single().TeamNameLong;

      List<GameTeam> gameTeams = _context.GameTeams
                              .Include(x => x.Season)
                              .Include(x => x.Game)
                              .Include(x => x.Team)
                              .Include(x => x.OpponentTeam)
                              .Where(x => x.SeasonId == seasonId && x.TeamId == teamId)
                              .ToList();

      iCalendar ical = new iCalendar();
      ical.Properties.Set("X-WR-CALNAME", "LO30Schedule-" + teamName.Replace(" ", "") + "-" + seasonName.Replace(" ", ""));
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
        //icalEvent.Location = gameTeam.Game.Location;
        //icalEvent.Location = "https://www.google.com/maps/place/Eddie+Edgar+Ice+Arena/@42.389168,-83.3795064,17z/data=!3m1!4b1!4m5!3m4!1s0x8824b31d35e8d599:0x7393b3c5db983c12!8m2!3d42.389168!4d-83.3773177";
        icalEvent.Location = "33841 Lyndon, Livonia, MI 48154";
        //icalEvent.Url = new Uri("https://www.google.com/maps/place/Eddie+Edgar+Ice+Arena/@42.389168,-83.3795064,17z/data=!3m1!4b1!4m5!3m4!1s0x8824b31d35e8d599:0x7393b3c5db983c12!8m2!3d42.389168!4d-83.3773177");
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
