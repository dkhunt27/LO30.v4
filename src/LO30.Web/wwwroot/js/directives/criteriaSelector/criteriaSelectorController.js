'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('lo30CriteriaSelectorController',
  [
    '$log',
    '$scope',
    'externalLibService',
    'apiService',
    'criteriaService',
    function ($log, $scope, externalLibService, apiService, criteriaService) {

      var _ = externalLibService._;
      var sjv = externalLibService.sjv;

      $scope.initializeScopeVariables = function () {

        $scope.local = {
          seasons: [],
          games: [],
          gamesToDisplay: [],
          gamesToDisplayMax: 10,
          gamesToDisplayIndex: 0,
          lastProcessedGameId: -1
        };
      };


      $scope.updateGamesToDisplay = function (index, displayMax) {

        // TODO, update to take into account media query / screen size
        $scope.local.gamesToDisplay = $scope.local.games.slice(index, index+displayMax);

        $scope.local.gamesToDisplayIndex = index;
      }

      $scope.displayPreviousGames = function () {

        var displayIndex = $scope.local.gamesToDisplayIndex - $scope.local.gamesToDisplayMax;

        $scope.updateGamesToDisplay(displayIndex, $scope.local.gamesToDisplayMax);

      };

      $scope.displayFutureGames = function () {

        var displayIndex = $scope.local.gamesToDisplayIndex + $scope.local.gamesToDisplayMax;

        $scope.updateGamesToDisplay(displayIndex, $scope.local.gamesToDisplayMax);

      };


      $scope.selectSeason = function (seasonId) {

        $scope.local.selectedSeason = _.find($scope.seasons(), function (season) { return season.seasonId === seasonId; });

      };

      $scope.selectGame = function (gameId) {

        $scope.local.selectedGame = _.find($scope.local.games, function (game) { return game.gameId === gameId; });

      };

      $scope.setWatches = function () {

        $scope.$watch('local.selectedSeason', function (newVal, oldVal) {

          if (sjv.isNotEmpty(newVal) && newVal !== oldVal) {

            $scope.fetchGames($scope.local.selectedSeason.seasonId);
            $scope.fetchLastProcessedGameId($scope.local.selectedSeason.seasonId);

          }
        });
      };

      $scope.activate = function () {

        $scope.initializeScopeVariables();

        $scope.setWatches();

        $scope.local.seasons = criteriaService.season.data().reverse();
        $scope.local.selectedSeason = criteriaService.season.get();

      };

      $scope.activate();
    }
  ]
);

