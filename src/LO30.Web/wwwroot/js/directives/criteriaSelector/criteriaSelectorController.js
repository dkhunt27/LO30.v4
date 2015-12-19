'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('lo30CriteriaSelectorController',
  [
    '$log',
    '$scope',
    'externalLibService',
    'apiService',
    function ($log, $scope, externalLibService, apiService) {

      var _ = externalLibService._;
      var sjv = externalLibService.sjv;

      $scope.initializeScopeVariables = function () {

        $scope.local = {
          seasons: [],
          selectedSeason: {},
          games: [],
          selectedGame: {},
          gamesToDisplay: [],
          gamesToDisplayMax: 10,
          gamesToDisplayIndex: 0,
          lastProcessedGameId: -1,

          fetchSeasonsCompleted: false,
          fetchGamesCompleted: false
        };
      };

      $scope.fetchSeasons = function () {

        $scope.local.fetchSeasonsCompleted = false;
        $scope.local.seasons = [];

        apiService.seasons.listForSeasonsWithGameSelection().then(function (fulfilled) {
          $scope.local.seasons = fulfilled.reverse();

          if (!$scope.local.selectedSeason || !$scope.local.selectedSeason.seasonName) {
            // default selected season to the current season
            $scope.local.selectedSeason = _.find($scope.local.seasons, function (season) { return season.isCurrentSeason === true; });
          }
        }).finally(function () {
          $scope.local.fetchSeasonsCompleted = true;
        });
      };

      $scope.fetchGames = function (seasonId) {

        $scope.local.fetchGamesCompleted = false;
        $scope.local.games = [];

        apiService.games.listForSeasonId(seasonId).then(function (fulfilled) {

          $scope.local.games = fulfilled;

          // TODO, some how determine what game to "select"...last game processed...closes game to today?

          var displayIndex = $scope.local.games.length - $scope.local.gamesToDisplayMax;

          $scope.updateGamesToDisplay(displayIndex, $scope.local.gamesToDisplayMax);

        }).finally(function () {

          $scope.local.fetchGamesCompleted = true;

        });
      };

      $scope.fetchLastProcessedGameId = function (seasonId) {

        $scope.local.fetchLastProcessedGameIdCompleted = false;
        $scope.local.lastProcessedGameId = -1;

        apiService.dataProcessing.getLastGameProcessedForSeasonId(seasonId).then(function (fulfilled) {

          $scope.local.lastProcessedGameId = fulfilled.gameId;

        }).finally(function () {

          $scope.local.fetchLastProcessedGameIdCompleted = true;

        });
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

        $scope.local.selectedSeason = _.find($scope.local.seasons, function (season) { return season.seasonId === seasonId; });

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

        $scope.fetchSeasons();

      };

      $scope.activate();
    }
  ]
);

