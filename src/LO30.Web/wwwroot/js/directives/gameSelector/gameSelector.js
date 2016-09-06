'use strict';

angular.module('lo30NgApp')
  .directive('lo30GameSelector',
  [
    function () {
      return {
        restrict: 'E',
        templateUrl: "js/directives/gameSelector/gameSelector.html",
        scope: {
        },
        controller: "lo30GameSelectorController",
        link: function (scope, element, attrs, controller) {
        }
      };
    }
  ]
);

