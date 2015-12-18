'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.directive('lo30PlayerStatsGame',
  [
    function () {
      return {
        restrict: 'E',
        templateUrl: "/Templates/Directives/PlayerStatsGame.html",
        scope: {
          "playerId": "=",
          "seasonId": "="
        },
        controller: "lo30PlayerStatsGameController",
        link: function (scope, element, attrs, controller) {
        }
      };
    }
  ]
);

