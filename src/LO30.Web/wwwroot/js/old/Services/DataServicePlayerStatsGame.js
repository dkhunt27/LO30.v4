'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.factory("dataServicePlayerStatsGame",
  [
    "constApisUrl",
    "$resource",
    function (constApisUrl, $resource) {

      // return multiple items
      var resourceQuery = $resource(constApisUrl + '/playerStatsGame/:playerId/:seasonId', { playerId: '@playerId', seasonId: '@seasonId' });

      // return single item
      var resourceGet = $resource(constApisUrl + '/playerStatGame/:playerId/:gameId', { playerId: '@playerId', gameId: '@gameId' });

      var listAll = function () {
        return resourceQuery.query();
      };

      var listByPlayerId = function (playerId) {
        return resourceQuery.query({ playerId: playerId });
      };

      var listByPlayerIdSeasonId = function (playerId, seasonId) {
        return resourceQuery.query({ playerId: playerId, seasonId: seasonId });
      };
      
      var getByPlayerIdGameId = function (playerId, gameId) {
        return resourceByPlayerIdGameId.get({ playerId: playerId, gameId: gameId });
      };

      return {
        listAll: listAll,
        listByPlayerId: listByPlayerId,
        listByPlayerIdSeasonId: listByPlayerIdSeasonId,
        getByPlayerIdGameId: getByPlayerIdGameId
      };
    }
  ]
);

