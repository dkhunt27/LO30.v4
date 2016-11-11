using LO30.Data;
using LO30.Data.AccessImport.Services;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace LO30.Data.AccessImport.Importers
{
  public partial class AccessImporter
  {
    public ImportStat ImportGameRosters()
    {
      string table = "GameRosters";
      var iStat = new ImportStat(_logger, table);

      if (_loadNewData || (_seed && _context.GameRosters.Count() == 0))
      {
        _logger.Write("Importing " + table);

        using (var transaction = _context.Database.BeginTransaction())
        {
          _context.Database.ExecuteSqlCommand("SET IDENTITY_INSERT " + table + " ON");

          dynamic parsedJsonGR = _jsonFileService.ParseObjectFromJsonFile(_folderPath + "GameRosters.json");
          int countGR = parsedJsonGR.Count;

          _logger.Write("ImportGameRosters: Access records to process:" + countGR);

          int countSaveOrUpdated = 0;
          for (var d = 0; d < parsedJsonGR.Count; d++)
          {
            if (d % 100 == 0) { _logger.Write("SaveOrUpdateGames:Access records processed:" + d); }
            var json = parsedJsonGR[d];

            int seasonId = json["SEASON_ID"];
            int gameId = json["GAME_ID"];

            //if (gameId >= startingGameIdToProcess && gameId <= endingGameIdToProcess)
            if (
              gameId == 3196 || gameId == 3197 || gameId == 3198 || gameId == 3199 ||
              gameId == 3998 || gameId == 3999 || gameId == 3400 || gameId == 3401
              )
            {
              // do nothing, practice games
            }
            else
            {
              var game = _lo30ContextService.FindGame(gameId);
              var gameDateYYYYMMDD = ConvertDateTimeIntoYYYYMMDD(game.GameDateTime, ifNullReturnMax: false);

              //var homeGameTeamId = _lo30ContextService.FindGameTeamByPK2(gameId, homeTeam: true).GameTeamId;
              //var awayGameTeamId = _lo30ContextService.FindGameTeamByPK2(gameId, homeTeam: false).GameTeamId;

              int homeTeamId = -1;
              if (json["HOME_TEAM_ID"] != null)
              {
                homeTeamId = json["HOME_TEAM_ID"];
              }

              int homePlayerId = -1;
              if (json["HOME_PLAYER_ID"] != null)
              {
                homePlayerId = json["HOME_PLAYER_ID"];
              }

              int homeSubPlayerId = -1;
              if (json["HOME_SUB_FOR_PLAYER_ID"] != null)
              {
                homeSubPlayerId = json["HOME_SUB_FOR_PLAYER_ID"];
              }

              bool homePlayerSubInd = false;
              if (json["HOME_PLAYER_SUB_IND"] != null)
              {
                homePlayerSubInd = json["HOME_PLAYER_SUB_IND"];
              }

              int homePlayerNumber = -1;
              if (json["HOME_PLAYER_NUMBER"] != null)
              {
                homePlayerNumber = json["HOME_PLAYER_NUMBER"];
              }

              if (homeTeamId == -1)
              {
                _logger.Write(string.Format("ImportGameRosters: The homeTeamId is -1, not sure how to process. homeTeamId:{0}, homePlayerId:{1}, homeSubPlayerId:{2}, homePlayerSubInd:{3}, homePlayerNumber:{4}, gameId:{5}", homeTeamId, homePlayerId, homeSubPlayerId, homePlayerSubInd, homePlayerNumber, gameId));
              }
              else if (homePlayerId == -1)
              {
                _logger.Write(string.Format("ImportGameRosters: The homePlayerId is -1, not sure how to process. homeTeamId:{0}, homePlayerId:{1}, homeSubPlayerId:{2}, homePlayerSubInd:{3}, homePlayerNumber:{4}, gameId:{5}", homeTeamId, homePlayerId, homeSubPlayerId, homePlayerSubInd, homePlayerNumber, gameId));
              }
              else if (homePlayerNumber == -1)
              {
                _logger.Write(string.Format("ImportGameRosters: The homePlayerNumber is -1, not sure how to process. homeTeamId:{0}, homePlayerId:{1}, homeSubPlayerId:{2}, homePlayerSubInd:{3}, homePlayerNumber:{4}, gameId:{5}", homeTeamId, homePlayerId, homeSubPlayerId, homePlayerSubInd, homePlayerNumber, gameId));
              }

              // set the line and position equal to the players drafted / set line position from the team roster
              var homeTeamRoster = _lo30ContextService.FindTeamRosterWithYYYYMMDD(homeTeamId, homePlayerId, gameDateYYYYMMDD);
              int homePlayerLine = homeTeamRoster.Line;
              string homePlayerPosition = homeTeamRoster.Position;

              int playerId;
              int? subbingForPlayerId;

              if (homePlayerSubInd)
              {
                playerId = homeSubPlayerId;
                subbingForPlayerId = homePlayerId;
              }
              else
              {
                playerId = homePlayerId;
                subbingForPlayerId = null;
              }

              bool isGoalie = false;
              if (homeTeamRoster.Position == "G")
              {
                isGoalie = true;
              }

              string ratingPrimary = "0";
              int ratingSecondary = 0;
              var playerRating = _lo30ContextService.FindPlayerRatingWithYYYYMMDD(playerId, homePlayerPosition, seasonId, gameDateYYYYMMDD, errorIfNotFound: false);

              if (playerRating != null)
              {
                ratingPrimary = playerRating.RatingPrimary;
                ratingSecondary = playerRating.RatingSecondary;
              }

              var gameRoster = new GameRoster()
              {
                GameId = gameId,
                Goalie = isGoalie,
                Line = homePlayerLine,
                PlayerId = playerId,
                PlayerNumber = homePlayerNumber.ToString(),
                Position = homePlayerPosition,
                RatingPrimary = ratingPrimary,
                RatingSecondary = ratingSecondary,
                SeasonId = seasonId,
                Sub = homePlayerSubInd,
                SubbingForPlayerId = subbingForPlayerId,
                TeamId = homeTeamId
              };
              
              countSaveOrUpdated = countSaveOrUpdated + _lo30ContextService.SaveOrUpdateGameRoster(gameRoster);

              int awayTeamId = -1;
              if (json["AWAY_TEAM_ID"] != null)
              {
                awayTeamId = json["AWAY_TEAM_ID"];
              }

              int awayPlayerId = -1;
              if (json["AWAY_PLAYER_ID"] != null)
              {
                awayPlayerId = json["AWAY_PLAYER_ID"];
              }

              int awaySubPlayerId = -1;
              if (json["AWAY_SUB_FOR_PLAYER_ID"] != null)
              {
                awaySubPlayerId = json["AWAY_SUB_FOR_PLAYER_ID"];
              }

              bool awayPlayerSubInd = false;
              if (json["AWAY_PLAYER_SUB_IND"] != null)
              {
                awayPlayerSubInd = json["AWAY_PLAYER_SUB_IND"];

              }

              int awayPlayerNumber = -1;
              if (json["AWAY_PLAYER_NUMBER"] != null)
              {
                awayPlayerNumber = json["AWAY_PLAYER_NUMBER"];
              }

              if (awayTeamId == -1)
              {
                _logger.Write(string.Format("SaveOrUpdateGameRosters: The awayTeamId is -1, not sure how to process. awayTeamId:{0}, awayPlayerId:{1}, awaySubPlayerId:{2}, awayPlayerSubInd:{3}, awayPlayerNumber:{4}, gameId:{5}", awayTeamId, awayPlayerId, awaySubPlayerId, awayPlayerSubInd, awayPlayerNumber, gameId));
              }
              else if (awayPlayerId == -1)
              {
                _logger.Write(string.Format("SaveOrUpdateGameRosters: The awayPlayerId is -1, not sure how to process. awayTeamId:{0}, awayPlayerId:{1}, awaySubPlayerId:{2}, awayPlayerSubInd:{3}, awayPlayerNumber:{4}, gameId:{5}", awayTeamId, awayPlayerId, awaySubPlayerId, awayPlayerSubInd, awayPlayerNumber, gameId));
              }
              else if (awayPlayerNumber == -1)
              {
                _logger.Write(string.Format("SaveOrUpdateGameRosters: The awayPlayerNumber is -1, not sure how to process. awayTeamId:{0}, awayPlayerId:{1}, awaySubPlayerId:{2}, awayPlayerSubInd:{3}, awayPlayerNumber:{4}, gameId:{5}", awayTeamId, awayPlayerId, awaySubPlayerId, awayPlayerSubInd, awayPlayerNumber, gameId));
              }

              if (awayPlayerSubInd)
              {
                playerId = awaySubPlayerId;
                subbingForPlayerId = awayPlayerId;
              }
              else
              {
                playerId = awayPlayerId;
                subbingForPlayerId = null;
              }

              // set the line and position equal to the players drafted / set line position from the team roster
              var awayTeamRoster = _lo30ContextService.FindTeamRosterWithYYYYMMDD(awayTeamId, awayPlayerId, gameDateYYYYMMDD);
              int awayPlayerLine = awayTeamRoster.Line;
              string awayPlayerPosition = awayTeamRoster.Position;

              isGoalie = false;
              if (awayTeamRoster.Position == "G")
              {
                isGoalie = true;
              }

              ratingPrimary = "0";
              ratingSecondary = 0;
              playerRating = _lo30ContextService.FindPlayerRatingWithYYYYMMDD(playerId, awayPlayerPosition, seasonId, gameDateYYYYMMDD, errorIfNotFound: false);

              if (playerRating != null)
              {
                ratingPrimary = playerRating.RatingPrimary;
                ratingSecondary = playerRating.RatingSecondary;
              }

              gameRoster = new GameRoster()
              {
                GameId = gameId,
                Goalie = isGoalie,
                Line = awayPlayerLine,
                PlayerId = playerId,
                PlayerNumber = awayPlayerNumber.ToString(),
                Position = awayPlayerPosition,
                RatingPrimary = ratingPrimary,
                RatingSecondary = ratingSecondary,
                SeasonId = seasonId,
                Sub = awayPlayerSubInd,
                SubbingForPlayerId = subbingForPlayerId,
                TeamId = awayTeamId
              };

              countSaveOrUpdated = countSaveOrUpdated + _lo30ContextService.SaveOrUpdateGameRoster(gameRoster);

            }
          }

          iStat.Imported();

          ContextSaveChanges();

          _context.Database.ExecuteSqlCommand("SET IDENTITY_INSERT " + table + " OFF");

          transaction.Commit();
        }
        iStat.Saved(_context.GameRosters.Count());
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