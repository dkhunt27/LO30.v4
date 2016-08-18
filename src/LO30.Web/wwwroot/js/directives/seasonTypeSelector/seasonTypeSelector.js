'use strict';

angular.module('lo30NgApp')
  .directive('lo30SeasonTypeSelector',
  [
    function () {
      return {
        restrict: 'E',
        templateUrl: "js/directives/seasonTypeSelector/seasonTypeSelector.html",
        scope: {
        },
        controller: "lo30SeasonTypeSelectorController",
        link: function (scope, element, attrs, controller) {
        }
      };
    }
  ]
);

