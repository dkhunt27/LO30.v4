'use strict';

angular.module('lo30NgApp')
  .directive('lo30GameScoreByPeriodDetailScoring',
  [
    function () {
      return {
        restrict: 'E',
        templateUrl: "js/directives/gameScoreByPeriodDetailScoring/gameScoreByPeriodDetailScoring.html",
        scope: {
          scoreSheetEntryGoals: '='
        },
        link: function (scope, element, attrs, controller) {
        }
      };
    }
  ]
);

