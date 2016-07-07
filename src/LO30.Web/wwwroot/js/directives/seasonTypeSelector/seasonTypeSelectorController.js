'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('lo30SeasonTypeSelectorController',
  [
    '$log',
    '$scope',
    'broadcastService',
    'externalLibService',
    'apiService',
    'criteriaService',
    function ($log, $scope, broadcastService, externalLibService, apiService, criteriaService) {

      var _ = externalLibService._;
      var sjv = externalLibService.sjv;

      $scope.initializeScopeVariables = function () {

        $scope.local = {
          seasons: []
        };
      };


      $scope.setWatches = function () {

        $scope.$watch('local.selectedSeasonType', function (newVal, oldVal) {

          if (sjv.isNotEmpty(newVal) && sjv.isNotEmpty(oldVal) && newVal !== oldVal) {

            criteriaService.seasonType.set($scope.local.selectedSeasonType);

          }
        });
      };

      $scope.activate = function () {

        $scope.initializeScopeVariables();

        $scope.setWatches();

        $scope.local.seasonTypes = criteriaService.seasonType.data();

        $scope.local.selectedSeasonType = criteriaService.seasonType.get();
      };

      $scope.activate();
    }
  ]
);

