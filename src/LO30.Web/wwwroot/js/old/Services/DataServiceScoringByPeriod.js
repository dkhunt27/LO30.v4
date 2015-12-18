'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.factory("dataServiceScoringByPeriod",
  [
    "constApisUrl",
    "$resource",
    "$http",
    function (constApisUrl, $resource, $http) {

      var resourceScoringByPeriod = $resource(constApisUrl + '/scoringByPeriod/:gameId', { gameId: '@gameId' });

      var listScoringByPeriodByGameId = function (gameId) {
        return resourceScoringByPeriod.query({ gameId: gameId });
      };

      return {
        listScoringByPeriodByGameId: listScoringByPeriodByGameId
      };
    }
  ]
);

