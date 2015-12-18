'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.directive('lo30PlayerStatsSeason',
  [
    function () {
      return {
        restrict: 'E',
        templateUrl: "/Templates/Directives/PlayerStatsSeason.html",
        scope: {
          "playerId": "=",
          "seasonId": "=",
          "playoffs": "="
        },
        controller: "lo30PlayerStatsSeasonController",
        link: function (scope, element, attrs, controller) {
        }
      };
    }
  ]
);

