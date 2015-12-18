'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.factory("dataServicePlayerStatsTeam",
  [
    "constApisUrl",
    "$resource",
    function (constApisUrl, $resource) {

      // return multiple items
      var resourceQuery = $resource(constApisUrl + '/playerStatsTeam/:playerId/:seasonId', { playerId: '@playerId', seasonId: '@seasonId' });

      // return single item
      var resourceGet = $resource(constApisUrl + '/playerStatTeam/:playerId/:teamId', { playerId: '@playerId', teamId: '@teamId' });

      var listAll = function () {
        return resourceQuery.query();
      };

      var listByPlayerId = function (playerId) {
        return resourceQuery.query({ playerId: playerId });
      };

      var listByPlayerIdSeasonId = function (playerId, seasonId) {
        return resourceQuery.query({ playerId: playerId, seasonId: seasonId });
      };
      
      var getByPlayerIdTeamId = function (playerId, teamId) {
        return resourceGet.get({ playerId: playerId, teamId: teamId });
      };

      return {
        listAll: listAll,
        listByPlayerId: listByPlayerId,
        listByPlayerIdSeasonId: listByPlayerIdSeasonId,
        getByPlayerIdTeamId: getByPlayerIdTeamId
      };
    }
  ]
);

