'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.factory("dataApiService",
  function (constApisUrl, $resource, alertService) {

    var performHttpGet = function (dataType, url) {

      $http({
        method: 'GET',
        url: url
      }).then(function successCallback(fullfilled) {
        alertService.successRetrieval(dataType, fullfilled.length);
        return results;
      }, function errorCallback(rejected) {
        alertService.errorRetrieval(dataType, rejected);
        return null;
      });

    }

    var listSeasons = function () {
      return performHttpGet("Seasons", "/seasons")
    }

    var listGamesForSeasonId = function () {
      return performHttpGet("Games", "/seasons/" + seasonId + "/games")
    }

    var listPlayerGameStatsForSeasonId = function (seasonId) {
      return performHttpGet("PlayerGameStats", "/seasons/" + seasonId + "/playerGameStats")
    }

    var listPlayerTeamStatsForSeasonId = function (seasonId) {
      return performHttpGet("PlayerTeamStats", "/seasons/" + seasonId + "/playerTeamStats")
    }

    return {
      listSeasons: listSeasons,
      listGamesForSeasonId: listGamesForSeasonId,

      // stats
      listPlayerGameStatsForSeasonId: listPlayerGameStatsForSeasonId,
      listPlayerTeamStatsForSeasonId: listPlayerTeamStatsForSeasonId
    };
  }
);

