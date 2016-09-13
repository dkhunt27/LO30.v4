using LO30.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace LO30.Data.AccessImport.Importers
{
  public partial class AccessImporter
  {
    public ImportStat ImportScoreSheetEntrySubs(int startingGameIdToProcess = 0, int endingGameIdToProcess = 99999999)
    {
      string table = "ScoreSheetEntrySubs";
      var iStat = new ImportStat(_logger, table);

      if (_loadNewData || (_seed && _context.ScoreSheetEntrySubs.Count() == 0))
      {
        _logger.Write("Importing " + table);

        using (var transaction = _context.Database.BeginTransaction())
        {
          _context.Database.ExecuteSqlCommand("SET IDENTITY_INSERT " + table + " ON");

          dynamic parsedJson = _jsonFileService.ParseObjectFromJsonFile(_folderPath + "ScoreSheetEntrySubs.json");
          int count = parsedJson.Count;
          int countSaveOrUpdated = 0;

          for (var d = 0; d < parsedJson.Count; d++)
          {
            if (d % 100 == 0) { _logger.Write("ImportScoreSheetEntrySubs: Access records processed:" + d + ". Records saved or updated:" + countSaveOrUpdated); }

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

              int seasonId = json["SEASON_ID"];
              string jersey = json["JERSEY"];
              int subId = json["SUB_ID"];
              int subForId = json["SUB_FOR_ID"];

              var scoreSheetEntrySub = new ScoreSheetEntrySub()
              {
                ScoreSheetEntrySubId = json["SCORE_SHEET_ENTRY_SUB_ID"],
                GameId = gameId,
                SubPlayerId = subId,
                HomeTeam = homeTeam,
                SubbingForPlayerId = subForId,
                JerseyNumber = jersey
              };

              countSaveOrUpdated = countSaveOrUpdated + _lo30ContextService.SaveOrUpdateScoreSheetEntrySub(scoreSheetEntrySub);

            }
          }

          iStat.Imported();

          ContextSaveChanges();

          _context.Database.ExecuteSqlCommand("SET IDENTITY_INSERT " + table + " OFF");

          transaction.Commit();
        }
        iStat.Saved(_context.ScoreSheetEntrySubs.Count());
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