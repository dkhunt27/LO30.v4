'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.factory("dataServiceForWebTeamStandings",
  [
    "constApisUrl",
    "$resource",
    "$http",
    function (constApisUrl, $resource, $http) {

      var resourceForWebTeamStandings = $resource(constApisUrl + '/forWebTeamStandings/:seasonId/:playoffs', { seasonId: '@seasonId', playoffs: '@playoffs' });
      var resourceFoWebTeamStandingsDataGoodThru = $resource(constApisUrl + '/forWebTeamStandingsDataGoodThru/:seasonId', { seasonId: '@seasonId' });

      var listForWebTeamStandings = function (seasonId, playoffs) {
        return resourceForWebTeamStandings.query({ seasonId: seasonId, playoffs: playoffs });
      };

      var getForWebTeamStandingsDataGoodThru = function (seasonId) {
        return resourceFoWebTeamStandingsDataGoodThru.get({ seasonId: seasonId });
      };

      return {
        listForWebTeamStandings: listForWebTeamStandings,
        getForWebTeamStandingsDataGoodThru: getForWebTeamStandingsDataGoodThru
      };
    }
  ]
);

