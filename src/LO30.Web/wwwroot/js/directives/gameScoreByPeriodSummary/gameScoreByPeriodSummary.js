'use strict';

angular.module('lo30NgApp')
  .directive('lo30GameScoreByPeriodSummary',
  [
    function () {
      return {
        restrict: 'E',
        templateUrl: "js/directives/gameScoreByPeriodSummary/gameScoreByPeriodSummary.html",
        scope: {
          gameId: '=',
          game: '='
        },
        controller: "lo30GameScoreByPeriodSummaryController",
        link: function (scope, element, attrs, controller) {
        }
      };
    }
  ]
);

