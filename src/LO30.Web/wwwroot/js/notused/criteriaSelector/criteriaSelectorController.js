'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('lo30CriteriaSelectorController',
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
          seasons: [],
          games: [],
          seasonTypes: []
        };
      };


      $scope.setWatches = function () {

        $scope.$watch('local.selectedSeason', function (newVal, oldVal) {

          if (sjv.isNotEmpty(newVal) && sjv.isNotEmpty(oldVal) && newVal !== oldVal) {

            criteriaService.season.set($scope.local.selectedSeason);

          }
        });

        $scope.$watch('local.selectedSeasonType', function (newVal, oldVal) {

          if (sjv.isNotEmpty(newVal) && sjv.isNotEmpty(oldVal) && newVal !== oldVal) {

            criteriaService.seasonType.set($scope.local.selectedSeasonType);

          }
        });

        $scope.$watch('local.selectedGame', function (newVal, oldVal) {

          if (sjv.isNotEmpty(newVal) && sjv.isNotEmpty(oldVal) && newVal !== oldVal) {

            criteriaService.game.set($scope.local.selectedGame);

          }
        });
      };

      $scope.activate = function () {

        $scope.initializeScopeVariables();

        $scope.setWatches();

        $scope.local.seasons = criteriaService.season.data();

        $scope.local.selectedSeason = criteriaService.season.get();

        $scope.local.seasonTypes = criteriaService.seasonType.data();

        $scope.local.selectedSeasonType = criteriaService.seasonType.get();

        $scope.local.games = criteriaService.game.data();

        $scope.local.selectedGame = criteriaService.game.get();

      };

      $scope.activate();
    }
  ]
);

