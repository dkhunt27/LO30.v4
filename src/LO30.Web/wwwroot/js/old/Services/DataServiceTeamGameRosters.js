'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.factory("dataServiceTeamGameRosters",
  [
    "constApisUrl",
    "$resource",
    "$http",
    function (constApisUrl, $resource, $http) {

      var resourceTeamGameRoster = $resource(constApisUrl + '/teamGameRoster/:gameId/:homeTeam', { gameId: '@gameId', homeTeam: '@homeTeam' });

      var listTeamGameRosterByGameIdAndHomeTeam = function (gameId, homeTeam) {
        return resourceTeamGameRoster.query({ gameId: gameId, homeTeam: homeTeam }).$promise;
      };

      return {
        listTeamGameRosterByGameIdAndHomeTeam: listTeamGameRosterByGameIdAndHomeTeam
      };
    }
  ]
);

