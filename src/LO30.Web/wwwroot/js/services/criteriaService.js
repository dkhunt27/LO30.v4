'use strict';

angular.module('lo30NgApp')
  .factory("criteriaService", function ($log, $q, $state, externalLibService, broadcastService) {

    var _ = externalLibService._;

    var seasons = [
        { "seasonId": 57, "seasonName": "2016 - 2017" },
        { "seasonId": 56, "seasonName": "2015 - 2016" },
        { "seasonId": 54, "seasonName": "2014 - 2015" },
        { "seasonId": 53, "seasonName": "2013 - 2014" },
        { "seasonId": 52, "seasonName": "2012 - 2013" },
        { "seasonId": 51, "seasonName": "2011 - 2012" },
        { "seasonId": 50, "seasonName": "2010 - 2011" },
        { "seasonId": 49, "seasonName": "2009 - 2010" },
        { "seasonId": 48, "seasonName": "2008 - 2009" },
        { "seasonId": 47, "seasonName": "2007 - 2008" },
        { "seasonId": 46, "seasonName": "2006 - 2007" },
        { "seasonId": 45, "seasonName": "2005 - 2006" },
        { "seasonId": 44, "seasonName": "2004 - 2005" },
        { "seasonId": 43, "seasonName": "2003 - 2004" },
        { "seasonId": 42, "seasonName": "2002 - 2003" },
        { "seasonId": 41, "seasonName": "2001 - 2002" },
        { "seasonId": 40, "seasonName": "2000 - 2001" }
    ];

    var decades = [
      { "decadeId": 4, "decadeName": "2010-2019", "seasons": [57, 56, 54, 53, 52, 51, 50] },
      { "decadeId": 3, "decadeName": "2000-2009", "seasons": [49, 48, 47, 46, 45, 44, 43, 42, 41, 40] }
      //{ "decadeId": 2, "decadeName": "1990-1999", "seasons": [] },
      //{ "decadeId": 1, "decadeName": "1980-1989", "seasons": [] },
      //{ "decadeId": 0, "decadeName": "1970-1979", "seasons": [] }
    ];

    var seasonTypes = [
      { seasonTypeId: 0, seasonTypeName: "Regular Season" },
      { seasonTypeId: 1, seasonTypeName: "Playoffs" }
    ];

    // set the defaults
    var selectedSeasonId = 57;
    var selectedSeasonTypeId = 0;

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

      seasonTypes = [{ seasonTypeId: 0, seasonTypeName: "Regular Season" }, { seasonTypeId: 1, seasonTypeName: "Playoffs" }];

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

    var service = {};

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

    service.decades = {
      get: function () {
        return decades.map(function (decade) {

          decade.hasSelectedSeason = false;

          decade.seasons = decade.seasons.map(function (item) {

            var season;

            // find the season
            // iniitally the seasons will be a list of integers, so will need to look them up
            // however, after initial load, the list will be the seasons...but will need to reset selected

            if (typeof item === "object") {
              season = item;
            } else {
              season = _.findWhere(seasons, { seasonId: item });
            }

            if (season.seasonId === selectedSeasonId) {
              season.isSelectedSeason = true;
              decade.hasSelectedSeason = true;
            } else {
              season.isSelectedSeason = false;
            }

            return season;
          });

          return decade;
        });
      }
    }

    service.seasons = {
      get: function () {

        if ($state.params.seasonId) {
          selectedSeasonId = parseInt($state.params.seasonId,10);
        }

        return _.findWhere(seasons, { seasonId: selectedSeasonId });

      },
      set: function (season) {

        if (season.seasonId !== selectedSeasonId) {

          selectedSeasonId = season.seasonId;

          broadcastService.emitEvent(broadcastService.events().seasonSet);
        }
      },
      setById: function (seasonId) {

        seasonId = parseInt(seasonId, 10);

        if (seasonId !== selectedSeasonId) {

          selectedSeasonId = parseInt(seasonId, 10);

          broadcastService.emitEvent(broadcastService.events().seasonSet);
        }
      }
    }

    service.seasonTypes = {
      get: function () {

        if ($state.params.seasonTypeId) {
          selectedSeasonTypeId = parseInt($state.params.seasonTypeId, 10);
        }
        return _.findWhere(seasonTypes, { seasonTypeId: selectedSeasonTypeId });

      },
      set: function (seasonType) {

        if (seasonType.seasonTypeId !== selectedSeasonTypeId) {

          selectedSeasonTypeId = seasonType.seasonTypeId;

          broadcastService.emitEvent(broadcastService.events().seasonTypeSet);
        }
      },
      setById: function (seasonTypeId) {

        seasonTypeId = parseInt(seasonTypeId, 10);

        if (seasonTypeId !== selectedSeasonTypeId) {

          selectedSeasonTypeId = seasonTypeId;

          broadcastService.emitEvent(broadcastService.events().seasonTypeSet);
        }
      }
    }

    service.games = {
      get: function () {

        return _.findWhere(games, { gameId: selectedGameId });

      },
      set: function (game) {

        if (game.gameId !== selectedGameId) {

          selectedGameId = game.gameId;

          broadcastService.emitEvent(broadcastService.events().gameSet);
        }
      },
      setById: function (gameId) {

        gameId = parseInt(gameId, 10);

        if (gameId !== selectedGameId) {

          selectedGameId = parseInt(gameId, 10);

          broadcastService.emitEvent(broadcastService.events().gameSet);
        }
      }
    }

    return service;
  }
);
