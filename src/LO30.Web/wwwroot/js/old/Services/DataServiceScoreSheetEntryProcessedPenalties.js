'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.factory("dataServiceScoreSheetEntryProcessedPenalties",
  [
    "constApisUrl",
    "$resource",
    function (constApisUrl, $resource) {

      // return multiple items
      var resourceQuery = $resource(constApisUrl + '/scoreSheetEntryProcessedPenalties/:gameId/:fullDetail', { gameId: '@gameId', fullDetail: '@fullDetail' });
      
      var listAll = function () {
        return resourceQuery.query();
      };

      var listByGameId = function (gameId, fullDetail) {
        return resourceQuery.query({ gameId: gameId, fullDetail: fullDetail });
      };

      return {
        listAll: listAll,
        listByGameId: listByGameId
      };
    }
  ]
);

