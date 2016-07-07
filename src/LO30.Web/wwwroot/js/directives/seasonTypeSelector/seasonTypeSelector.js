'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.directive('lo30SeasonTypeSelector',
  [
    function () {
      return {
        restrict: 'E',
        templateUrl: "/views/directives/seasonTypeSelector.html",
        scope: {
        },
        controller: "lo30SeasonTypeSelectorController",
        link: function (scope, element, attrs, controller) {
        }
      };
    }
  ]
);

