'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.directive('lo30PlayerStatsTeam',
  [
    function () {
      return {
        restrict: 'E',
        templateUrl: "/Templates/Directives/PlayerStatsTeam.html",
        scope: {
          "playerId": "=",
          "seasonId": "="
        },
        controller: "lo30PlayerStatsTeamController",
        link: function (scope, element, attrs, controller) {
        }
      };
    }
  ]
);

