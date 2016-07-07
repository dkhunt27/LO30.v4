'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('lo30SeasonSelectorController',
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

        $scope.$watch('local.selectedSeason', function (newVal, oldVal) {

          if (sjv.isNotEmpty(newVal) && sjv.isNotEmpty(oldVal) && newVal !== oldVal) {

            criteriaService.season.set($scope.local.selectedSeason);

          }
        });
      };

      $scope.activate = function () {

        $scope.initializeScopeVariables();

        $scope.setWatches();

        $scope.local.seasons = criteriaService.season.data();

        $scope.local.selectedSeason = criteriaService.season.get();
      };

      $scope.activate();
    }
  ]
);

