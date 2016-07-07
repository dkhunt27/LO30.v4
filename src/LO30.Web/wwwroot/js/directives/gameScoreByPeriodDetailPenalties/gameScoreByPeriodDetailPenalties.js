'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.directive('lo30GameScoreByPeriodDetailPenalties',
  [
    function () {
      return {
        restrict: 'E',
        templateUrl: "/views/directives/gameScoreByPeriodDetailPenalties.html",
        scope: {
          scoreSheetEntryPenalties: '='
        },
        link: function (scope, element, attrs, controller) {
        }
      };
    }
  ]
);

