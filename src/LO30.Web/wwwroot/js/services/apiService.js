'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.factory("apiService",
    function (externalLibService, apiBaseService) {

      var _ = externalLibService._;

      var service = {
        dataProcessing: {},
        games: {},
        seasons: {},
        teamStandings: {}
      };

      service.dataProcessing.getLastGameProcessedForSeasonId = function (seasonId) {
        var inputs = {
          apiDataType: "dataProcessing.getLastGameProcessedForSeasonId",
          urlPartial: "dataprocessing/lastprocessedgameid/seasons/" + seasonId,
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs);
      }

      service.games.listForSeasonId = function (seasonId) {
        var inputs = {
          apiDataType: "games.listForSeasonId",
          urlPartial: "games/seasons/" + seasonId,
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs);
      }

      service.seasons.list = function () {
        var inputs = {
          apiDataType: "seasons.list",
          urlPartial: "seasons",
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs).then(function (fulfilled) {
          return _.reject(fulfilled, function (item) { return item.seasonId === -1; })
        });
      }

      service.seasons.listForSeasonsWithGameSelection = function () {
        var inputs = {
          apiDataType: "seasons.list",
          urlPartial: "seasons",
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs).then(function (fulfilled) {
          return _.filter(fulfilled, function (item) { return item.seasonId >= 43; })
        });
      }

      service.teamStandings.listForSeasonIdPlayoffs = function (seasonId, playoffs) {
        var inputs = {
          apiDataType: "teamStandings.listForSeasonIdPlayoffs",
          urlPartial: "teamstandings/seasons/" + seasonId + "/playoffs/" + playoffs,
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs);
      }


      return service;
    }
);
