'use strict';

angular.module('lo30NgApp')
  .directive('lo30GameScoreByPeriodDetailPenalties',
  [
    function () {
      return {
        restrict: 'E',
        templateUrl: "js/directives/gameScoreByPeriodDetailPenalties/gameScoreByPeriodDetailPenalties.html",
        scope: {
          scoreSheetEntryPenalties: '='
        },
        link: function (scope, element, attrs, controller) {
        }
      };
    }
  ]
);

