'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.factory("dataServicePlayerStatsCareer",
  [
    "constApisUrl",
    "$resource",
    function (constApisUrl, $resource) {

      // return multiple items
      var resourceQuery = $resource(constApisUrl + '/playerStatsCareer');

      // return single item
      var resourceGet = $resource(constApisUrl + '/playerStatsCareer/:playerId', { playerId: '@playerId' });

      var listAll = function () {
        return resourceQuery.query().$promise;
      };

      var getByPlayerId = function (playerId) {
        return resourceGet.get({ playerId: playerId }).$promise;
      };

      return {
        listAll: listAll,
        getByPlayerId: getByPlayerId
      };
    }
  ]
);

