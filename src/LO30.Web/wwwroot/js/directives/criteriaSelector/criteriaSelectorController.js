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
          seasonTypes: [ 'Regular Season', false],
          gamesToDisplay: [],
          gamesToDisplayMax: 10,
          gamesToDisplayIndex: 0,
          lastProcessedGameId: -1
        };
      };


      //$scope.updateGamesToDisplay = function (index, displayMax) {

      //  // TODO, update to take into account media query / screen size
      //  $scope.local.gamesToDisplay = $scope.local.games.slice(index, index+displayMax);

      //  $scope.local.gamesToDisplayIndex = index;
      //}

      //$scope.displayPreviousGames = function () {

      //  var displayIndex = $scope.local.gamesToDisplayIndex - $scope.local.gamesToDisplayMax;

      //  $scope.updateGamesToDisplay(displayIndex, $scope.local.gamesToDisplayMax);

      //};

      //$scope.displayFutureGames = function () {

      //  var displayIndex = $scope.local.gamesToDisplayIndex + $scope.local.gamesToDisplayMax;

      //  $scope.updateGamesToDisplay(displayIndex, $scope.local.gamesToDisplayMax);

      //};


      //$scope.selectSeason = function (seasonId) {

      //  $scope.local.selectedSeason = _.find($scope.seasons(), function (season) { return season.seasonId === seasonId; });

      //};

      //$scope.selectGame = function (gameId) {

      //  $scope.local.selectedGame = _.find($scope.local.games, function (game) { return game.gameId === gameId; });

      //};

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

        $scope.$on(broadcastService.events().seasonSet, function () {

          $scope.local.seasons = criteriaService.season.data();

          $scope.local.selectedSeason = criteriaService.season.get();
        });

        $scope.$on(broadcastService.events().seasonTypeSet, function () {

          $scope.local.seasonTypes = criteriaService.seasonType.data();

          $scope.local.selectedSeasonType = criteriaService.seasonType.get();
        });

        $scope.$on(broadcastService.events().gameSet, function () {

          $scope.local.games = criteriaService.game.data();

          $scope.local.selectedGame = criteriaService.game.get();
        });
      };

      $scope.activate = function () {

        $scope.initializeScopeVariables();

        $scope.setWatches();

        criteriaService.initialize();

      };

      $scope.activate();
    }
  ]
);

