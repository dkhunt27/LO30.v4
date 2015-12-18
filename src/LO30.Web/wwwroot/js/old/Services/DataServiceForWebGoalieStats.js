'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.factory("dataServiceForWebGoalieStats",
  [
    "constApisUrl",
    "$resource",
    "$http",
    function (constApisUrl, $resource, $http) {

      var resourceForWebGoalieStats = $resource(constApisUrl + '/forWebGoalieStats/:seasonId/:playoffs', { seasonId: '@seasonId', playoffs: '@playoffs' });
      var resourceForWebGoalieStatsDataGoodThru = $resource(constApisUrl + '/forWebGoalieStatsDataGoodThru/:seasonId', { seasonId: '@seasonId' });

      var listForWebGoalieStats = function (seasonId, playoffs) {
        return resourceForWebGoalieStats.query({ seasonId: seasonId, playoffs: playoffs });
      };

      var getForWebGoalieStatsDataGoodThru = function (seasonId) {
        return resourceForWebGoalieStatsDataGoodThru.get({ seasonId: seasonId });
      };

      return {
        listForWebGoalieStats: listForWebGoalieStats,
        getForWebGoalieStatsDataGoodThru: getForWebGoalieStatsDataGoodThru
      };
    }
  ]
);

