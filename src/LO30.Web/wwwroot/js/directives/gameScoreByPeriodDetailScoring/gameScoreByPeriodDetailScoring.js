'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.directive('lo30GameScoreByPeriodDetailScoring',
  [
    function () {
      return {
        restrict: 'E',
        templateUrl: "/views/directives/gameScoreByPeriodDetailScoring.html",
        scope: {
          scoreSheetEntryGoals: '='
        },
        link: function (scope, element, attrs, controller) {
        }
      };
    }
  ]
);

