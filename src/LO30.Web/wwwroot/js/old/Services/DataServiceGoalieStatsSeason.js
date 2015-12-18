'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.factory("dataServiceGoalieStatsSeason",
  [
    "constApisUrl",
    "$resource",
    function (constApisUrl, $resource) {

      // return multiple items
      var resourceQuery = $resource(constApisUrl + '/goalieStatsSeason/:playerId/:seasonId', { playerId: '@playerId', seasonId: '@seasonId' });

      // return single item
      var resourceGet = $resource(constApisUrl + '/goalieStatSeason/:playerId/:seasonId/:sub', { playerId: '@playerId', seasonId: '@seasonId', sub: '@sub' });

      var listAll = function () {
        return resourceQuery.query();
      };

      var listByPlayerId = function (playerId) {
        return resourceQuery.query({ playerId: playerId });
      };

      var listByPlayerIdSeasonId = function (playerId, seasonId) {
        return resourceQuery.query({ playerId: playerId, seasonId: seasonId });
      };
      
      var getByPlayerIdSeasonIdSub = function (playerId, seasonId, sub) {
        return resourceGet.get({ playerId: playerId, seasonId: seasonId, sub: sub });
      };

      return {
        listAll: listAll,
        listByPlayerId: listByPlayerId,
        listByPlayerIdSeasonId: listByPlayerIdSeasonId,
        getByPlayerIdSeasonIdSub: getByPlayerIdSeasonIdSub
      };
    }
  ]
);

