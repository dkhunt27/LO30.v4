'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.factory("criteriaService",
  function ($log, $q, apiService, externalLibService, broadcastService) {

    var _ = externalLibService._;

    var service = {
      season: {},
      seasonType: {},
      game: {}
    };

    var seasons, games, seasonTypes;

    var criteria = {
      season: "not set",
      seasonType: "not set",
      game: "not set"
    };

    var fetchSeasons = function () {

      seasons = [];

      return apiService.seasons.listForSeasonsWithGameSelection().then(function (fulfilled) {

        seasons = fulfilled;

        if (service.season.isNotSet()) {
          // default selected season to the current season

          var currentSeason = _.find(seasons, function (season) { return season.isCurrentSeason === true; });

          service.season.set(currentSeason);

        }
        
        return seasons;
      });
    };

    var fetchSeasonTypes = function (gamePlayoffs) {
      return $q(function (fulfill) {

        seasonTypes = ["Regular Season", "Playoffs"];

        if (gamePlayoffs) {

          service.seasonType.set("Playoffs");

        } else {

          service.seasonType.set("Regular Season");

        }

        return fulfill(seasonTypes);
      });
    };

    var fetchGames = function (seasonId) {

      games = [];

      return apiService.games.listForSeasonId(seasonId).then(function (fulfilled) {

        games = fulfilled;

        return apiService.dataProcessing.getLastGameProcessedForSeasonId(seasonId)

      }).then(function (fulfilled) {

        var lastProcessedGame = _.find(games, function (game) { return game.gameId === fulfilled.gameId; });

        service.game.set(lastProcessedGame);

        return games;

      });
    };

    service.initialize = function () {
      return $q(function (fulfill, reject) {

        var promises = [];

        if (service.season.isNotSet()) {

          promises.push(fetchSeasons());

        } else {

          $log.debug("criteriaService.initialize() season already set");

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

        if (criteria.season !== season) {

          criteria.season = season;

          broadcastService.emitEvent(broadcastService.events().seasonSet);

          fetchGames(season.seasonId);
        }

      },
      data: function () {

        return seasons.reverse();

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

        if (criteria.seasonType !== seasonType) {

          criteria.seasonType = seasonType;

          broadcastService.emitEvent(broadcastService.events().seasonTypeSet);

        }

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

        criteria.game = game;

        broadcastService.emitEvent(broadcastService.events().gameSet);

        fetchSeasonTypes(game.playoffs);
      },
      data: function () {

        return games.reverse();

      }
    }


    return service;
  }
);
