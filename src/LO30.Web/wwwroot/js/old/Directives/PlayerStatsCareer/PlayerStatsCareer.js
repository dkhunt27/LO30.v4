'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.directive('lo30PlayerStatsCareer',
  [
    function () {
      return {
        restrict: 'E',
        templateUrl: "/Templates/Directives/PlayerStatsCareer.html",
        scope: {
          "playerId": "="
        },
        controller: "lo30PlayerStatsCareerController",
        link: function (scope, element, attrs, controller) {
        }
      };
    }
  ]
);

