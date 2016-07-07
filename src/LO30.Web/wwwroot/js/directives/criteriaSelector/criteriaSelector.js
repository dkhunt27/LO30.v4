'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.directive('lo30CriteriaSelector',
  [
    function () {
      return {
        restrict: 'E',
        templateUrl: "/views/directives/criteriaSelector.html",
        scope: {
        },
        controller: "lo30CriteriaSelectorController",
        link: function (scope, element, attrs, controller) {
        }
      };
    }
  ]
);

