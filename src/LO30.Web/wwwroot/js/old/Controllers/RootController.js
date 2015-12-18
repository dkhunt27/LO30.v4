'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('rootController',
  [
    '$scope',
    '$route',
    '$routeParams',
    '$location',
    function ($scope, $route, $routeParams, $location) {
      $scope.$route = $route;
      $scope.$location = $location;
      $scope.$routeParams = $routeParams;


      $scope.activate = function () {
      };

      $scope.activate();
    }
  ]
);

