'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.factory("dataServiceGameScores",
  [
    "constApisUrl",
    "$resource",
    function (constApisUrl, $resource) {

      var resourceGameScores = $resource(constApisUrl + '/gameScores/:fullDetail', { fullDetail: '@fullDetail' });
      var resourceGameScoresByGameId = $resource(constApisUrl + '/gameScores/:gameId/:fullDetail', { gameId: '@gameId', fullDetail: '@fullDetail' });
      var resourceGameScoresByGameIdAndHomeTeam = $resource(constApisUrl + '/gameScores/:gameId/:homeTeam/:fullDetail', { gameId: '@gameId', homeTeam: '@homeTeam', fullDetail: '@fullDetail' });

      var listGameScores = function (fullDetail) {
        return resourceGameScores.query({ fullDetail: fullDetail });
      };

      var listGameScoresByGameId = function (gameId, fullDetail) {
        return resourceGameScoresByGameId.query({ gameId: gameId, fullDetail: fullDetail });
      };

      var listGameScoresByGameIdAndHomeTeam = function (gameId, homeTeam, fullDetail) {
        return resourceGameScoresByGameIdAndHomeTeam.query({ gameId: gameId, homeTeam: homeTeam, fullDetail: fullDetail });
      };

      return {
        listGameScores: listGameScores,
        listGameScoresByGameId: listGameScoresByGameId,
        listGameScoresByGameIdAndHomeTeam: listGameScoresByGameIdAndHomeTeam
      };
    }
  ]
);

