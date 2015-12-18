'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('homeController',
  [
    '$scope',
    function ($scope) {

      $scope.initializeScopeVariables = function () {
      }

      $scope.setWatches = function () {
      }

      $scope.activate = function () {
        $scope.initializeScopeVariables();
        $scope.setWatches();
      };

      $scope.activate();
    }
  ]
);

