'use strict';

angular.module('lo30NgApp')
  .directive('lo30GameScoreByPeriodDetail',
  [
    function () {
      return {
        restrict: 'E',
        templateUrl: "js/directives/gameScoreByPeriodDetail/gameScoreByPeriodDetail.html",
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

