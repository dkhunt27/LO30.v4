'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.factory("dataServiceGameOutcomes",
  [
    "constApisUrl",
    "$resource",
    function (constApisUrl, $resource) {

      var resourceGameOutcomes = $resource(constApisUrl + '/gameOutcomes', {});
      var resourceGameOutcomesByGameId = $resource(constApisUrl + '/gameOutcomes/:gameId', { gameId: '@gameId' });
      var resourceGameOutcomesByTeamId = $resource(constApisUrl + '/gameOutcomesByTeam/:seasonId/:playoffs/:teamId', { seasonId: '@seasonId', playoffs: '@playoffs', teamId: '@teamId' });

      var resourceGameOutcomeByGameIdAndHomeTeam = $resource(constApisUrl + '/gameOutcome/:gameId/:homeTeam', { gameId: '@gameId', homeTeam: '@homeTeam' });

      var listGameOutcomes = function () {
        return resourceGameOutcomes.query({});
      };

      var listGameOutcomesByGameId = function (gameId) {
        return resourceGameOutcomesByGameId.query({ gameId: gameId });
      };

      var getGameOutcomeByGameIdAndHomeTeam = function (gameId, homeTeam) {
        return resourceGameOutcomesByGameIdAndHomeTeam.get({ gameId: gameId, homeTeam: homeTeam });
      };

      var listGameOutcomesByTeamId = function (seasonId, playoffs, teamId) {
        return resourceGameOutcomesByTeamId.query({ seasonId: seasonId, playoffs: playoffs, teamId: teamId });
      };

      return {
        listGameOutcomes: listGameOutcomes,
        listGameOutcomesByGameId: listGameOutcomesByGameId,
        getGameOutcomeByGameIdAndHomeTeam: getGameOutcomeByGameIdAndHomeTeam,
        listGameOutcomesByTeamId: listGameOutcomesByTeamId
      };
    }
  ]
);

