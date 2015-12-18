'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.factory("dataServiceGameTeams",
  [
    "constApisUrl",
    "$resource",
    function (constApisUrl, $resource) {

      var resourceGameTeams = $resource(constApisUrl + '/gameTeams');
      var resourceGameTeamsByGameId = $resource(constApisUrl + '/gameTeams/:gameId', { gameId: '@gameId' });
      var resourceGameTeamByGameIdAndHomeTeam = $resource(constApisUrl + '/gameTeam/:gameId/:homeTeam', { gameId: '@gameId', homeTeam: '@homeTeam' });
      var resourceGameTeamByGameTeamId = $resource(constApisUrl + '/gameTeam/:gameTeamId', { gameTeamId: '@gameTeamId' });

      var listGameTeams = function () {
        return resourceGameTeams.query();
      };

      var listGameTeamsByGameId = function (gameId) {
        return resourceGameTeamsByGameId.query({ gameId: gameId });
      };

      var getGameTeamByGameIdAndHomeTeam = function (gameId, homeTeam) {
        return resourceGameTeamByGameIdAndHomeTeam.get({ gameId: gameId, homeTeam: homeTeam });
      };

      var getGameTeamByGameTeamId = function (gameTeamId) {
        return resourceByGameTeamId.get({ gameTeamId: gameTeamId });
      };

      return {
        listGameTeams: listGameTeams,
        listGameTeamsByGameId: listGameTeamsByGameId,
        getGameTeamByGameIdAndHomeTeam: getGameTeamByGameIdAndHomeTeam,
        getGameTeamByGameTeamId: getGameTeamByGameTeamId,
      };
    }
  ]
);

