'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.directive('lo30GoalieStatsCareer',
  [
    function () {
      return {
        restrict: 'E',
        templateUrl: "/Templates/Directives/GoalieStatsCareer.html",
        scope: {
          "playerId": "=",
          "playoffs": "="
        },
        controller: "lo30GoalieStatsCareerController",
        link: function (scope, element, attrs, controller) {
        }
      };
    }
  ]
);

