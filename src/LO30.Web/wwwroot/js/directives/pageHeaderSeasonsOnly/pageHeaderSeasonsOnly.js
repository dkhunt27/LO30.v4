'use strict';

angular.module('lo30NgApp')
  .directive('lo30PageHeaderSeasonsOnly',
  [
    function () {
      return {
        restrict: 'E',
        templateUrl: "js/directives/pageHeaderSeasonsOnly/pageHeaderSeasonsOnly.html",
        scope: {
        },
        controller: "lo30PageHeaderSeasonsOnlyController",
        link: function (scope, element, attrs, controller) {
        }
      };
    }
  ]
);

