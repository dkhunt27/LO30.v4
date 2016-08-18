'use strict';

angular.module('lo30NgApp')
  .directive('lo30SeasonSelector',
  [
    function () {
      return {
        restrict: 'E',
        templateUrl: "js/directives/seasonSelector/seasonSelector.html",
        scope: {
        },
        controller: "lo30SeasonSelectorController",
        link: function (scope, element, attrs, controller) {
        }
      };
    }
  ]
);

