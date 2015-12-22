﻿'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.factory("criteriaService",
  function ($log, $q, apiService, externalLibService, broadcastService) {

    var _ = externalLibService._;

    var service = {
      season: {},
      playoffs: {},
      game: {}
    };

    var seasons, playoffs, games, lastProcessedGameId;

    var criteria = {
      season: "not set",
      playoffs: "not set",
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

    var fetchGames = function (seasonId) {

      games = [];

      return apiService.games.listForSeasonId(seasonId).then(function (fulfilled) {

        games = fulfilled;

        return apiService.dataProcessing.getLastGameProcessedForSeasonId(seasonId)

      }).then(function (fulfilled) {

        var lastProcessedGame = _.find(games, function (game) { return game.gameId === fulfilled.gameId; });

        service.game.set(lastProcessedGame);

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

          fetchGames(season.seasonId);

          broadcastService.emitEvent(broadcastService.events().seasonSet);
        }

      },
      data: function () {

        return seasons;

      }
    }

    service.playoffs = {

      isNotSet: function () {

        if (criteria.playoffs === "not set") {

          return true;

        } else {

          return false;

        }
      },
      get: function () {

        return criteria.playoffs;

      },
      set: function (playoffs) {

        criteria.playoffs = playoffs;

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
      },
      data: function () {

        return games;

      }
    }


    return service;
  }
);
