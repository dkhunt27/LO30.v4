using LO30.Data;
using LO30.Data.AccessImport.Services;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace LO30.Data.AccessImport.Importers
{
  public partial class AccessImporter
  {
    private TimeService _timeService = new TimeService();

    public ImportStat ImportGames(int startingGameIdToProcess = 0, int endingGameIdToProcess = 99999999)
    {
      string table = "Games";
      var iStat = new ImportStat(_logger, table);

      if (_loadNewData || (_seed && _context.Games.Count() == 0))
      {
        _logger.Write("Importing " + table);

        using (var transaction = _context.Database.BeginTransaction())
        {
          _context.Database.ExecuteSqlCommand("SET IDENTITY_INSERT " + table + " ON");

          dynamic parsedJson = _jsonFileService.ParseObjectFromJsonFile(_folderPath + "Games.json");
          int count = parsedJson.Count;

          _logger.Write("SaveOrUpdateGames:Access records to process:" + count);

          int countSaveOrUpdated = 0;
          for (var d = 0; d < parsedJson.Count; d++)
          {
            if (d % 100 == 0) { _logger.Write("SaveOrUpdateGames:Access records processed:" + d); }
            var json = parsedJson[d];

            int gameId = json["GAME_ID"];
            if (gameId >= startingGameIdToProcess && gameId <= endingGameIdToProcess)
            {
              int seasonId = json["SEASON_ID"];
              DateTime gameDate = json["GAME_DATE"];
              DateTime gameTime = json["GAME_TIME"];
              bool playoffGame = json["PLAYOFF_GAME_IND"];

              var timeSpan = new TimeSpan(gameTime.Hour, gameTime.Minute, gameTime.Second);

              var gameDateTime = gameDate.Add(timeSpan);

              // determine the location
              string location = "Eddie Edgar Rink B";

              if (
                   (gameTime.Hour == 8 && gameTime.Minute == 30) ||
                   (gameTime.Hour == 9 && gameTime.Minute == 45)
                 )
              {
                location = "Eddie Edgar Rink A";
              }

              var game = new Game()
              {
                SeasonId = seasonId,
                GameId = gameId,
                GameDateTime = gameDateTime,
                GameYYYYMMDD = _timeService.ConvertDateTimeIntoYYYYMMDD(gameDateTime, false),
                Location = location,
                Playoffs = playoffGame
              };

              //context.Games.Add(game);  // works only if never reprocessing data

              countSaveOrUpdated = countSaveOrUpdated + _lo30ContextService.SaveOrUpdateGame(game);
            }
          }

          iStat.Imported();

          ContextSaveChanges();

          _context.Database.ExecuteSqlCommand("SET IDENTITY_INSERT " + table + " OFF");

          transaction.Commit();
        }
        iStat.Saved(_context.Games.Count());
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