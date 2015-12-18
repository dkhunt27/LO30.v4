'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.directive('lo30TeamGameRosterPlayer',
  [
    function () {
      return {
        restrict: 'E',
        templateUrl: "/Templates/Directives/TeamGameRosterPlayer.html",
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

