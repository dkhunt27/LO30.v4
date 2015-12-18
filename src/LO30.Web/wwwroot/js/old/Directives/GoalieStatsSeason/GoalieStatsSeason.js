'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.directive('lo30GoalieStatsSeason',
  [
    function () {
      return {
        restrict: 'E',
        templateUrl: "/Templates/Directives/GoalieStatsSeason.html",
        scope: {
          "playerId": "=",
          "seasonId": "=",
          "playoffs": "="
        },
        controller: "lo30GoalieStatsSeasonController",
        link: function (scope, element, attrs, controller) {
        }
      };
    }
  ]
);

