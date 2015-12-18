'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.directive('lo30GoalieStatsTeam',
  [
    function () {
      return {
        restrict: 'E',
        templateUrl: "/Templates/Directives/GoalieStatsTeam.html",
        scope: {
          "playerId": "=",
          "seasonId": "=",
          "playoffs": "="
        },
        controller: "lo30GoalieStatsTeamController",
        link: function (scope, element, attrs, controller) {
        }
      };
    }
  ]
);

