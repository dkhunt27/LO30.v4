'use strict';

angular.module('lo30NgApp')
  .factory("criteriaServiceOLD",
  function ($log, $q, apiService, externalLibService, broadcastService) {

    var _ = externalLibService._;

    var service = {
      season: {},
      seasonType: {},
      game: {},
      gameLastProcessed: {}
    };

    var seasons, games, seasonTypes;

    var criteria = {
      season: "not set",
      seasonType: "not set",
      game: "not set"
    };

    var fetchSeasons = function () {

      $log.debug("criteriaService.fetchSeasons()");

      seasons = [];
      
      return apiService.seasons.listForSeasonsWithGameSelection().then(function (fulfilled) {

        seasons = fulfilled;

        if (service.season.isNotSet()) {
          // default selected season to the current season

          var currentSeason = _.find(seasons, function (season) { return season.isCurrentSeason === true; });

          return service.season.set(currentSeason);

        } else {

          return service.season.get();
        }
      });
    };

    var fetchSeasonTypes = function (gamePlayoffs, seasonId) {

        $log.debug("criteriaService.fetchSeasonTypes()  for seasonId:" + seasonId + " for gamePlayoffs: " + gamePlayoffs);

        seasonTypes = [ {seasonTypeId: 0, seasonTypeName: "Regular Season"}, {seasonTypeId:1, seasonTypeName: "Playoffs"}];

        var seasonType;

        if (gamePlayoffs) {

          seasonType = _.find(seasonTypes, function (seasonType) { return seasonType.seasonTypeName === "Playoffs"; });

          return service.seasonType.set(seasonType);

        } else {

          seasonType = _.find(seasonTypes, function (seasonType) { return seasonType.seasonTypeName === "Regular Season"; });

          return service.seasonType.set(seasonType);

        }
    };

    var fetchGames = function (seasonId) {

      $log.debug("criteriaService.fetchGames() for seasonId:" + seasonId);

      games = [];
      
      return apiService.games.listForSeasonId(seasonId).then(function (fulfilled) {

        games = fulfilled;

        return apiService.dataProcessing.getLastGameProcessedForSeasonId(seasonId)

      }).then(function (fulfilled) {

        var lastProcessedGame = _.find(games, function (game) { return game.gameId === fulfilled.gameId; });

        return service.game.set(lastProcessedGame);

      });
    };

    service.initialize = function () {
      return $q(function (fulfill, reject) {

        var promises = [];

        if (service.season.isNotSet()) {

          promises.push(fetchSeasons());

        } else {

          $log.debug("criteriaService.initialize() season already set");

          // rebroadcast that season is set
          broadcastService.emitEvent(broadcastService.events().seasonSet);

        }

        if (service.game.isNotSet()) {

          // no need to fetch...will be done when seasons are fetched

        } else {

          $log.debug("criteriaService.initialize() game already set");

          // rebroadcast that game is set
          broadcastService.emitEvent(broadcastService.events().gameSet);

        }

        if (service.seasonType.isNotSet()) {

          // no need to fetch...will be done when games are fetched

        } else {

          $log.debug("criteriaService.initialize() seasonType already set");

          // rebroadcast that seasonType is set
          broadcastService.emitEvent(broadcastService.events().seasonTypeSet);

        }

        $q.all(promises).finally(function (fulfilled) {

          return fulfill(fulfilled);

        }, function (rejected) {

          $log.error("Error while trying to criteriaService.initialize()", rejected);

          return reject(rejected);

        });
      });
    };

    service.season = {

      isNotSet: function () {

        if (criteria.season === "not set") {

          return true;

        } else {

          return false;

        }
      },
      get: function () {

        return criteria.season;

      },
      set: function (season) {

        return $q(function (fulfill) {

          if (criteria.season !== season) {

            criteria.season = season;

            broadcastService.emitEvent(broadcastService.events().seasonSet);

            return fetchGames(season.seasonId).then(function () {

              return fulfill(criteria.season);

            });
          } else {

            return fulfill(criteria.season);

          }
        });
      }, 
      setById: function (seasonId) {

        return $q(function (fulfill) {

          if (criteria.season.seasonId !== seasonId) {

            var season = _.find(seasons, function (season) { return season.seasonId === seasonId; });

            return service.season.set(season);

          } else {

            return fulfill(criteria.season);

          }
        });

      },
      data: function () {

        if (seasons) {

          return seasons.reverse();

        } else {

          return seasons;

        }

      }
    }

    service.seasonType = {

      isNotSet: function () {

        if (criteria.seasonType === "not set") {

          return true;

        } else {

          return false;

        }
      },
      get: function () {

        return criteria.seasonType;

      },
      set: function (seasonType) {

        return $q(function (fulfill) {

          if (criteria.seasonType !== seasonType) {

            criteria.seasonType = seasonType;

            broadcastService.emitEvent(broadcastService.events().seasonTypeSet);
        
          } 

          return fulfill(criteria.seasonType);

        });
      },
      data: function () {

        return seasonTypes;

      }
    }

    service.game = {

      isNotSet: function () {

        if (criteria.game === "not set") {

          return true;

        } else {

          return false;

        }
      },
      get: function () {

        return criteria.game;

      },
      set: function (game) {

        return $q(function (fulfill) {

          if (criteria.game !== game) {

            criteria.game = game;

            broadcastService.emitEvent(broadcastService.events().gameSet);

            return fetchSeasonTypes(game.playoffs, game.seasonId).then(function () {

              return fulfill(criteria.game);

            });

          } else {

            return fulfill(criteria.game);

          }
        });
      },
      setById: function (gameId) {

        return $q(function (fulfill) {

          if (criteria.game.gameId !== gameId) {

            var game = _.find(games, function (season) { return season.gameId === gameId; });

            return service.game.set(game);

          } else {

            return fulfill(criteria.game);

          }
        });
      },
      data: function () {

        if (games) {

          return games.reverse();

        } else {

          return games;

        }
      }
    }


    return service;
  }
);
