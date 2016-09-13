using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using LO30.Data.AccessImport.Importers;
using LO30.Data.AccessImport.Services;
using LO30.Data;

namespace LO30.Web.Controllers.Mvc
{
  public class AccessImporterController : Controller
  {
    LO30DbContext _context;
    public AccessImporterController(LO30DbContext context)
    {
      _context = context;
    }

    public IActionResult Index()
    {
      LogService logService = new LogService();
      LogWriter logger = logService.CreateLogger();

      if (logger.IsLoggingEnabled())
      {
        logger.Write("Logging enabled");
      }
      else
      {
        Console.WriteLine("Logging is disabled in the configuration.");
      }

      using (_context)
      {
        // determine the current status
        var x = _context.Seasons.ToList();

        var loadNewDataOnly = true;

        var aImporter = new AccessImporter(logService.CreateLogger(), _context, !loadNewDataOnly, loadNewDataOnly);

        // now comment/uncomment the tables to process

        // load new season
        int startingSeasonIdToProcess = 57;
        int endingSeasonIdToProcess = 57;
        int startingGameIdToProcess = 3616;
        int endingGameIdToProcess = 3735;
        aImporter.ImportSeasons(startingSeasonIdToProcess, endingSeasonIdToProcess);
        //aImporter.ImportPlayers();
        //aImporter.ImportPlayerStatuses();
        //aImporter.ImportPlayerRatings(startingSeasonIdToProcess, endingSeasonIdToProcess);
        //aImporter.ImportPlayerDrafts(startingSeasonIdToProcess, endingSeasonIdToProcess);
        //aImporter.ImportTeams(startingSeasonIdToProcess, endingSeasonIdToProcess);
        //aImporter.ImportTeamRosters(startingSeasonIdToProcess, endingSeasonIdToProcess);
        //aImporter.ImportGames(startingGameIdToProcess, endingGameIdToProcess);
        //aImporter.ImportGameTeams(startingGameIdToProcess, endingGameIdToProcess);

        // load player updates
        //aImporter.ImportPlayers();
        //aImporter.ImportPlayerStatuses();

        // load playoff updates
        //int startingSeasonIdToProcess = 56;
        //int endingSeasonIdToProcess = 56;
        //startingGameIdToProcess = 3562;
        //endingGameIdToProcess = 3601;
        //aImporter.ImportPlayerDrafts(startingSeasonIdToProcess, endingSeasonIdToProcess);
        //aImporter.ImportPlayerRatings(startingSeasonIdToProcess, endingSeasonIdToProcess);
        //aImporter.ImportTeamRosters(startingSeasonIdToProcess, endingSeasonIdToProcess);
        //aImporter.ImportGames(startingGameIdToProcess, endingGameIdToProcess);
        //aImporter.ImportGameTeams(startingGameIdToProcess, endingGameIdToProcess);

        // load scoresheets
        //aImporter.ImportScoreSheetEntries(startingGameIdToProcess, endingGameIdToProcess);
        //aImporter.ImportScoreSheetEntryPenalties(startingGameIdToProcess, endingGameIdToProcess);
        //aImporter.ImportScoreSheetEntrySubs(startingGameIdToProcess, endingGameIdToProcess);
      }

      ViewData["Message"] = "Access Imported Ran";

      return View();
    }

    public IActionResult About()
    {
      ViewData["Message"] = "Your application description page.";

      return View();
    }

    public IActionResult Contact()
    {
      ViewData["Message"] = "Your contact page.";

      return View();
    }

    public IActionResult Error()
    {
      return View();
    }
  }
}
