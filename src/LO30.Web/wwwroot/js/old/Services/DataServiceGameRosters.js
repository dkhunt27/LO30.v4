'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.factory("dataServiceGameRosters",
  [
    "constApisUrl",
    "$resource",
    function (constApisUrl, $resource) {

      var resourceGameRosters = $resource(constApisUrl + '/gameRosters');
      var resourceGameRostersByGameId = $resource(constApisUrl + '/gameRosters/:gameId', { gameId: '@gameId' });
      var resourceGameRostersByGameIdAndHomeTeam = $resource(constApisUrl + '/gameRosters/:gameId/:homeTeam', { gameId: '@gameId', homeTeam: '@homeTeam' });

      var resourceGameRosterByGameRosterId = $resource(constApisUrl + '/gameRoster/:gameRosterId', { gameRosterId: '@gameRosterId' });
      var resourceGameRosterByGameTeamIdAndPlayerNumber = $resource(constApisUrl + '/gameRoster/:gameRosterId', { gameId: '@gameId', playerNumber: '@playerNumber' });

      var listGameRosters = function () {
        return resourceGameRosters.query();
      };

      var listGameRostersByGameId = function (gameId) {
        return resourceGameRostersByGameId.query({ gameId: gameId });
      };

      var listGameRostersByGameIdAndHomeTeam = function (gameId, homeTeam) {
        return resourceGameRostersByGameIdAndHomeTeam.query({ gameId: gameId, homeTeam: homeTeam });
      };

      var getGameRosterByGameRosterId = function (gameRosterId) {
        return resourceByGameRosterId.get({ gameRosterId: gameRosterId });
      };

      var getGameRosterByGameTeamIdAndPlayerNumber = function (gameRosterId, playerNumber) {
        return resourceGameRosterByGameTeamIdAndPlayerNumber.get({ gameRosterId: gameRosterId, playerNumber: playerNumber });
      };

      return {
        listGameRosters: listGameRosters,
        listGameRostersByGameId: listGameRostersByGameId,
        listGameRostersByGameIdAndHomeTeam: listGameRostersByGameIdAndHomeTeam,
        getGameRosterByGameRosterId: getGameRosterByGameRosterId,
        getGameRosterByGameTeamIdAndPlayerNumber: getGameRosterByGameTeamIdAndPlayerNumber
      };
    }
  ]
);

