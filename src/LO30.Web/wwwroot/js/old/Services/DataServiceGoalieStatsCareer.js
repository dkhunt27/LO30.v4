'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.factory("dataServiceGoalieStatsCareer",
  [
    "constApisUrl",
    "$resource",
    function (constApisUrl, $resource) {

      // return multiple items
      var resourceQuery = $resource(constApisUrl + '/goalieStatsCareer/:playerId', { playerId: '@playerId' });

      // return single item
      var resourceGet = $resource(constApisUrl + '/goalieStatCareer/:playerId/:sub', { playerId: '@playerId', sub: '@sub' });

      var listAll = function () {
        return resourceQuery.query();
      };

      var listByPlayerId = function (playerId) {
        return resourceQuery.query({ playerId: playerId });
      };
      
      var getByPlayerIdSub = function (playerId, seasonId, sub) {
        return resourceGet.get({ playerId: playerId, sub: sub });
      };

      return {
        listAll: listAll,
        listByPlayerId: listByPlayerId,
        getByPlayerIdSub: getByPlayerIdSub
      };
    }
  ]
);

