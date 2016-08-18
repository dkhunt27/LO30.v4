'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.directive('lo30GameScoreByPeriodDetailGoalies',
  [
    function () {
      return {
        restrict: 'E',
        templateUrl: "/views/directives/gameScoreByPeriodDetailGoalies.html",
        scope: {
          goalieStatGameWinner: '=',
          goalieStatGameLoser: '=',
          goalieStatGames: '='
        },
        link: function (scope, element, attrs, controller) {
        }
      };
    }
  ]
);

