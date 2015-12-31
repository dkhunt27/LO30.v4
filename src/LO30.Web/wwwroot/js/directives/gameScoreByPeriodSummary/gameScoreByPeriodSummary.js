'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.directive('lo30GameScoreByPeriodSummary',
  [
    function () {
      return {
        restrict: 'E',
        templateUrl: "/views/directives/gameScoreByPeriodSummary.html",
        scope: {
          gameId: '='
        },
        controller: "lo30GameScoreByPeriodSummaryController",
        link: function (scope, element, attrs, controller) {
        }
      };
    }
  ]
);

