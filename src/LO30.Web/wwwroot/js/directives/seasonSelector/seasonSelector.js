'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.directive('lo30SeasonSelector',
  [
    function () {
      return {
        restrict: 'E',
        templateUrl: "/views/directives/seasonSelector.html",
        scope: {
        },
        controller: "lo30SeasonSelectorController",
        link: function (scope, element, attrs, controller) {
        }
      };
    }
  ]
);

