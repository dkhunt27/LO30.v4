'use strict';

angular.module('lo30NgApp')
  .directive('lo30PageHeaderSeasons',
  [
    function () {
      return {
        restrict: 'E',
        templateUrl: "js/directives/pageHeaderSeasons/pageHeaderSeasons.html",
        scope: {
        },
        controller: "lo30PageHeaderSeasonsController",
        link: function (scope, element, attrs, controller) {
        }
      };
    }
  ]
);

