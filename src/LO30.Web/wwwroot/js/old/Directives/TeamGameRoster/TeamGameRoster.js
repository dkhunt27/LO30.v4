'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.directive('lo30TeamGameRoster',
  [
    function () {
      return {
        restrict: 'E',
        templateUrl: "/Templates/Directives/TeamGameRoster.html",
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

