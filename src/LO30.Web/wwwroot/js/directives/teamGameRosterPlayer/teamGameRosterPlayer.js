'use strict';

angular.module('lo30NgApp')
  .directive('lo30TeamGameRosterPlayer',
  [
    function () {
      return {
        restrict: 'E',
        templateUrl: "js/directives/teamGameRosterPlayer/teamGameRosterPlayer.html",
        scope: {
          "teamGameRosterItem": "=",
          "subs": "=",
          "locked": "="
        },
        controller: "lo30TeamGameRosterPlayerController",
        link: function (scope, element, attrs, controller) {
        }
      };
    }
  ]
);

