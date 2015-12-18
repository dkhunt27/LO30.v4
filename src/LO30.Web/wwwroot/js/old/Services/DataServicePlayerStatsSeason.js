'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.factory("dataServicePlayerStatsSeason",
  [
    "constApisUrl",
    "$resource",
    function (constApisUrl, $resource) {

      // return multiple items
      var resourceQuery = $resource(constApisUrl + '/playerStatsSeason/:playerId/:seasonId', { playerId: '@playerId', seasonId: '@seasonId' });

      // return single item
      var resourceGet = $resource(constApisUrl + '/playerStatSeason/:playerId/:seasonId/:playoffs', { playerId: '@playerId', seasonId: '@seasonId', playoffs: '@playoffs' });

      var listAll = function () {
        return resourceQuery.query();
      };

      var listByPlayerId = function (playerId) {
        return resourceQuery.query({ playerId: playerId });
      };

      var listByPlayerIdSeasonId = function (playerId, seasonId) {
        return resourceQuery.query({ playerId: playerId, seasonId: seasonId });
      };
      
      var getByPlayerIdSeasonIdPlayoffs = function (playerId, seasonId, playoffs) {
        return resourceGet.get({ playerId: playerId, seasonId: seasonId, playoffs: playoffs });
      };

      return {
        listAll: listAll,
        listByPlayerId: listByPlayerId,
        listByPlayerIdSeasonId: listByPlayerIdSeasonId,
        getByPlayerIdSeasonIdPlayoffs: getByPlayerIdSeasonIdPlayoffs
      };
    }
  ]
);

