'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.directive('lo30FilterBy',
  [
    function () {
      return {
        restrict: 'E',
        templateUrl: "/views/directives/filterBy.html",
        scope: {
          gameId: '='
        },
        controller: "lo30FilterByController",
        link: function (scope, element, attrs, controller) {
        }
      };
    }
  ]
);

