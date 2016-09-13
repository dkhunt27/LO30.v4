﻿using LO30.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace LO30.Data.AccessImport.Importers
{
  public partial class AccessImporter
  {
    public ImportStat ImportScoreSheetEntries(int startingGameIdToProcess = 0, int endingGameIdToProcess = 99999999)
    {
      string table = "ScoreSheetEntryGoals";
      var iStat = new ImportStat(_logger, table);

      if (_loadNewData || (_seed && _context.ScoreSheetEntryGoals.Count() == 0))
      {
        _logger.Write("Importing " + table);

        using (var transaction = _context.Database.BeginTransaction())
        {
          _context.Database.ExecuteSqlCommand("SET IDENTITY_INSERT " + table + " ON");

          dynamic parsedJson = _jsonFileService.ParseObjectFromJsonFile(_folderPath + "ScoreSheetEntries.json");
          int count = parsedJson.Count;
          int countSaveOrUpdated = 0;

          for (var d = 0; d < parsedJson.Count; d++)
          {
            if (d % 100 == 0) { _logger.Write("ImportScoreSheetEntries: Access records processed:" + d + ". Records saved or updated:" + countSaveOrUpdated); }

            var json = parsedJson[d];
            int gameId = json["GAME_ID"];

            if (gameId >= startingGameIdToProcess && gameId <= endingGameIdToProcess)
            {
              bool homeTeam = true;
              string teamJson = json["TEAM"];
              string team = teamJson.ToLower();
              if (team == "2" || team == "v" || team == "a" || team == "g")
              {
                homeTeam = false;
              }

              var scoreSheetEntry = new ScoreSheetEntryGoal()
              {
                ScoreSheetEntryGoalId = json["SCORE_SHEET_ENTRY_ID"],
                GameId = gameId,
                Period = json["PERIOD"],
                HomeTeam = homeTeam,
                Goal = json["GOAL"],
                Assist1 = json["ASSIST1"],
                Assist2 = json["ASSIST2"],
                Assist3 = json["ASSIST3"],
                TimeRemaining = json["TIME_REMAINING"],
                ShortHandedPowerPlay = json["SH_PP"]
              };

              countSaveOrUpdated = countSaveOrUpdated + _lo30ContextService.SaveOrUpdateScoreSheetEntryGoal(scoreSheetEntry);

            }
          }

          iStat.Imported();

          ContextSaveChanges();

          _context.Database.ExecuteSqlCommand("SET IDENTITY_INSERT " + table + " OFF");

          transaction.Commit();
        }
        iStat.Saved(_context.ScoreSheetEntryGoals.Count());
      }
      else
      {
        _logger.Write(table + " records exist in context; not importing");
        iStat.Imported();
        iStat.Saved(0);
      }

      iStat.Log();

      return iStat;
    }
  }
}