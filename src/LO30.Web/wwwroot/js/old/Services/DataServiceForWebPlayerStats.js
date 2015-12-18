'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.factory("dataServiceForWebPlayerStats",
  [
    "constApisUrl",
    "$resource",
    "$http",
    function (constApisUrl, $resource, $http) {

      var resourceForWebPlayerStats = $resource(constApisUrl + '/forWebPlayerStats/:seasonId/:playoffs', { seasonId: '@seasonId', playoffs: '@playoffs' });
      var resourceForWebPlayerStatsDataGoodThru = $resource(constApisUrl + '/forWebPlayerStatsDataGoodThru/:seasonId', { seasonId: '@seasonId' });

      var listForWebPlayerStats = function (seasonId, playoffs) {
        return resourceForWebPlayerStats.query({ seasonId: seasonId, playoffs: playoffs });
      };

      var getForWebPlayerStatsDataGoodThru = function (seasonId) {
        return resourceForWebPlayerStatsDataGoodThru.get({ seasonId: seasonId });
      };

      return {
        listForWebPlayerStats: listForWebPlayerStats,
        getForWebPlayerStatsDataGoodThru: getForWebPlayerStatsDataGoodThru
      };
    }
  ]
);

