'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.directive('lo30GoalieStatsGame',
  [
    function () {
      return {
        restrict: 'E',
        templateUrl: "/Templates/Directives/GoalieStatsGame.html",
        scope: {
          "playerId": "=",
          "seasonId": "="
        },
        controller: "lo30GoalieStatsGameController",
        link: function (scope, element, attrs, controller) {
        }
      };
    }
  ]
);

