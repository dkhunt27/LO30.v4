'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.directive('lo30GameScoreByPeriodDetail',
  [
    function () {
      return {
        restrict: 'E',
        templateUrl: "/views/directives/gameScoreByPeriodDetail.html",
        scope: {
          gameId: '='
        },
        controller: "lo30GameScoreByPeriodDetailController",
        link: function (scope, element, attrs, controller) {
        }
      };
    }
  ]
);

