'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.directive('lo30ScoringDetail',
  [
    function () {
      return {
        restrict: 'E',
        templateUrl: "/Templates/Directives/ScoringDetail.html",
        scope: {
          "gameId": "="
        },
        controller: "lo30ScoringDetailController",
        link: function (scope, element, attrs, controller) {
        }
      };
    }
  ]
);

