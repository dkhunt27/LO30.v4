using LO30.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace LO30.Data.AccessImport.Importers
{
  public partial class AccessImporter
  {
    public ImportStat ImportGameTeams(int startingGameIdToProcess = 0, int endingGameIdToProcess = 99999999)
    {
      string table = "GameTeams";
      var iStat = new ImportStat(_logger, table);

      if (_loadNewData || (_seed && _context.GameTeams.Count() == 0))
      {
        _logger.Write("Importing " + table);

        using (var transaction = _context.Database.BeginTransaction())
        {
          //_context.Database.ExecuteSqlCommand("SET IDENTITY_INSERT " + table + " ON");

          dynamic parsedJson = _jsonFileService.ParseObjectFromJsonFile(_folderPath + "Games.json");
          int count = parsedJson.Count;

          _logger.Write("ImportGameTeams: Access records to process:" + count);

          int countSaveOrUpdated = 0;
          for (var d = 0; d < parsedJson.Count; d++)
          {
            if (d % 100 == 0) { _logger.Write("ImportGameTeams: Access records processed:" + d); }
            var json = parsedJson[d];

            int gameId = json["GAME_ID"];

            if (gameId >= startingGameIdToProcess && gameId <= endingGameIdToProcess)
            {
              int seasonId = json["SEASON_ID"];

              int homeTeamId, awayTeamId;


              homeTeamId = json["HOME_TEAM_ID"];
              awayTeamId = json["AWAY_TEAM_ID"];


              // FK check
              //_lo30ContextService.FindGame(gameId, errorIfNotFound: true, errorIfMoreThanOneFound: true, populateFully: false);
              //_lo30ContextService.FindTeam(homeTeamId, errorIfNotFound: true, errorIfMoreThanOneFound: true, populateFully: false);
              //_lo30ContextService.FindTeam(awayTeamId, errorIfNotFound: true, errorIfMoreThanOneFound: true, populateFully: false);

              var gameTeam = new GameTeam()
              {
                SeasonId = seasonId,
                GameId = gameId,
                HomeTeam = true,
                TeamId = homeTeamId,
                OpponentTeamId = awayTeamId
              };
              countSaveOrUpdated = countSaveOrUpdated + _lo30ContextService.SaveOrUpdateGameTeam(gameTeam);

              gameTeam = new GameTeam()
              {
                SeasonId = seasonId,
                GameId = gameId,
                HomeTeam = false,
                TeamId = awayTeamId,
                OpponentTeamId = homeTeamId
              };
              countSaveOrUpdated = countSaveOrUpdated + _lo30ContextService.SaveOrUpdateGameTeam(gameTeam);
            }
          }

          iStat.Imported();

          ContextSaveChanges();

          //_context.Database.ExecuteSqlCommand("SET IDENTITY_INSERT " + table + " OFF");

          transaction.Commit();
        }
        iStat.Saved(_context.GameTeams.Count());
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