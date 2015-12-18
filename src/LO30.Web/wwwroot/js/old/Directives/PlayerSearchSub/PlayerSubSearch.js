'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.directive('lo30PlayerSubSearch',
  [
    function () {
      return {
        restrict: 'E',
        templateUrl: "/Templates/Directives/PlayersSubSearch.html",
        scope: {
          "position": "=",
          "ratingMin": "=",
          "ratingMax": "="
        },
        controller: "lo30PlayerSubSearchController",
        link: function (scope, element, attrs, controller) {
        }
      };
    }
  ]
);

