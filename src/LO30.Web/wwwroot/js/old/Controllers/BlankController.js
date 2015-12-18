'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('blankController',
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
        $scope.$watch('someField', function (newVal, oldVal) {
          if (newVal && newVal !== oldVal) {
            //do something
          }
        }, true);
      };

      $scope.activate = function () {
        $scope.initializeScopeVariables();
        $scope.setWatches();
      };

      $scope.activate();
    }
  ]
);

