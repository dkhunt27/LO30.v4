using LO30.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace LO30.Data.AccessImport.Importers
{
  public partial class AccessImporter
  {
    public ImportStat ImportScoreSheetEntryPenalties(int startingGameIdToProcess = 0, int endingGameIdToProcess = 99999999)
    {
      string table = "ScoreSheetEntryPenalties";
      var iStat = new ImportStat(_logger, table);

      if (_loadNewData || (_seed && _context.ScoreSheetEntryPenalties.Count() == 0))
      {
        _logger.Write("Importing " + table);

        using (var transaction = _context.Database.BeginTransaction())
        {
          _context.Database.ExecuteSqlCommand("SET IDENTITY_INSERT " + table + " ON");

          dynamic parsedJson = _jsonFileService.ParseObjectFromJsonFile(_folderPath + "ScoreSheetEntryPenalties.json");
          int count = parsedJson.Count;
          int countSaveOrUpdated = 0;

          for (var d = 0; d < parsedJson.Count; d++)
          {
            if (d % 100 == 0) { _logger.Write("ImportScoreSheetEntryPenalties: Access records processed:" + d + ". Records saved or updated:" + countSaveOrUpdated); }

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

              var scoreSheetEntryPenalty = new ScoreSheetEntryPenalty()
              {
                ScoreSheetEntryPenaltyId = json["SCORE_SHEET_ENTRY_PENALTY_ID"],
                GameId = json["GAME_ID"],
                Period = json["PERIOD"],
                HomeTeam = homeTeam,
                Player = json["PLAYER"],
                PenaltyCode = json["PENALTY_CODE"],
                TimeRemaining = json["TIME_REMAINING"],
                PenaltyMinutes = json["PENALTY_MINUTES"]
              };

              countSaveOrUpdated = countSaveOrUpdated + _lo30ContextService.SaveOrUpdateScoreSheetEntryPenalty(scoreSheetEntryPenalty);

            }
          }
          iStat.Imported();

          ContextSaveChanges();

          _context.Database.ExecuteSqlCommand("SET IDENTITY_INSERT " + table + " OFF");

          transaction.Commit();
        }
        iStat.Saved(_context.ScoreSheetEntryPenalties.Count());
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