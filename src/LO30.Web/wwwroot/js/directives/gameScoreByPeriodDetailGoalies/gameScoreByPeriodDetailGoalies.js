'use strict';

angular.module('lo30NgApp')
  .directive('lo30GameScoreByPeriodDetailGoalies',
  [
    function () {
      return {
        restrict: 'E',
        templateUrl: "js/directives/gameScoreByPeriodDetailGoalies/gameScoreByPeriodDetailGoalies.html",
        scope: {
          goalieStatGameWinner: '=',
          goalieStatGameLoser: '='
        },
        link: function (scope, element, attrs, controller) {
        }
      };
    }
  ]
);

