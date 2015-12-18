'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('testPlayerSubSearchController',
  [
    '$scope',
    function ($scope) {

      $scope.initializeScopeVariables = function () {
        $scope.data = {
        };

        $scope.requests = {
        };

        $scope.user = {
        };
      };

      $scope.setWatches = function () {
      };

      $scope.activate = function () {
        $scope.initializeScopeVariables();
        $scope.setWatches();
      };

      $scope.activate();
    }
  ]
);

