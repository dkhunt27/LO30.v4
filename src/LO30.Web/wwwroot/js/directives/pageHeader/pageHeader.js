'use strict';

angular.module('lo30NgApp')
  .directive('lo30PageHeader',
  [
    function () {
      return {
        restrict: 'E',
        templateUrl: "js/directives/pageHeader/pageHeader.html",
        scope: {
        },
        controller: "lo30PageHeaderController",
        link: function (scope, element, attrs, controller) {
        }
      };
    }
  ]
);

