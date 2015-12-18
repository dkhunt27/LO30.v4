'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.directive('lo30SeasonSelector',
  [
    function () {
      return {
        restrict: 'E',
        templateUrl: "/Templates/Directives/SeasonSelector.html",
        scope: {
        },
        controller: "lo30SeasonSelectorController",
        link: function (scope, element, attrs, controller) {
        }
      };
    }
  ]
);

