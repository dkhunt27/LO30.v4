'use strict';

angular.module('lo30NgApp')
  .directive('lo30PageHeaderGames',
  [
    function () {
      return {
        restrict: 'E',
        templateUrl: "js/directives/pageHeaderGames/pageHeaderGames.html",
        scope: {
        },
        controller: "lo30PageHeaderGamesController",
        link: function (scope, element, attrs, controller) {
        }
      };
    }
  ]
);

