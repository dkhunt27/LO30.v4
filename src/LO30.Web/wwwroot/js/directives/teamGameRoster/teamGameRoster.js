'use strict';

angular.module('lo30NgApp')
  .directive('lo30TeamGameRoster',
  [
    function () {
      return {
        restrict: 'E',
        templateUrl: "js/directives/teamGameRoster/teamGameRoster.html",
        scope: {
          "teamGameRosterItems": "=",
          "homeTeam": "=",
          "subs": "=",
          "locked": "="
        },
        controller: "lo30TeamGameRosterController",
        link: function (scope, element, attrs, controller) {
        }
      };
    }
  ]
);

