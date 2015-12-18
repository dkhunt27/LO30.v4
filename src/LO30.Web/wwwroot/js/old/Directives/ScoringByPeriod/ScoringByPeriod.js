'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.directive('lo30ScoringByPeriod',
  [
    function () {
      return {
        restrict: 'E',
        templateUrl: "/Templates/Directives/ScoringByPeriod.html",
        scope: {
          "gameId": "="
        },
        controller: "lo30ScoringByPeriodController",
        link: function (scope, element, attrs, controller) {
        }
      };
    }
  ]
);

