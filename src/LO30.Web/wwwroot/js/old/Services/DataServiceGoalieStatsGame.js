'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.factory("dataServiceGoalieStatsGame",
  [
    "constApisUrl",
    "$resource",
    function (constApisUrl, $resource) {

      // return multiple items
      var resourceQueryByGameId = $resource(constApisUrl + '/goalieStatsGame/:gameId', { gameId: '@gameId' });
      var resourceQueryByPlayerIdSeasonId = $resource(constApisUrl + '/goalieStatsGame/:playerId/:seasonId', { playerId: '@playerId', seasonId: '@seasonId' });

      // return single item
      var resourceGet = $resource(constApisUrl + '/goalieStatGame/:playerId/:gameId', { playerId: '@playerId', gameId: '@gameId' });

      var listAll = function () {
        return resourceQueryByGameId.query();
      };

      var listByGameId = function (gameId) {
        return resourceQueryByGameId.query({ gameId: gameId });
      };

      var listByPlayerIdSeasonId = function (playerId, seasonId) {
        return resourceQueryByPlayerIdSeasonId.query({ playerId: playerId, seasonId: seasonId });
      };
      
      var getByPlayerIdGameId = function (playerId, gameId) {
        return resourceGet.get({ playerId: playerId, gameId: gameId });
      };

      return {
        listAll: listAll,
        listByGameId: listByGameId,
        listByPlayerIdSeasonId: listByPlayerIdSeasonId,
        getByPlayerIdGameId: getByPlayerIdGameId
      };
    }
  ]
);

