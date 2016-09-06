'use strict';

angular.module('lo30NgApp')
  .controller('lo30GameScoreByPeriodSummaryController',
  [
    '$log',
    '$scope',
    'externalLibService',
    'apiService',
    'screenSize',
    function ($log, $scope, externalLibService, apiService, screenSize) {

      var _ = externalLibService._;

      $scope.initializeScopeVariables = function () {

        $scope.local = {
          game: {},

          fetchGameCompleted: false
        };
      };


      $scope.fetchGame = function (gameId) {

        $scope.local.fetchGameCompleted = false;

        $scope.local.game = {};

        apiService.games.getForGameId(gameId).then(function (fulfilled) {

          $scope.local.game = fulfilled;

          $scope.buildGameToDisplay();

        }).finally(function () {

          $scope.local.fetchPlayerStatGamesCompleted = true;

        });
      };

      $scope.buildGameToDisplay = function () {

        $scope.local.gameToDisplay = _.clone($scope.local.game);

        if (screenSize.is('xs, sm')) {

          $scope.local.gameToDisplay.teamNameAwayToDisplay = $scope.local.game.teamCodeAway;
          $scope.local.gameToDisplay.teamNameHomeToDisplay = $scope.local.game.teamCodeHome;

        } else if (screenSize.is('md')) {

          $scope.local.gameToDisplay.teamNameAwayToDisplay = $scope.local.game.teamNameShortAway;
          $scope.local.gameToDisplay.teamNameHomeToDisplay = $scope.local.game.teamNameShortHome;

        } else {

          $scope.local.gameToDisplay.teamNameAwayToDisplay = $scope.local.game.teamNameLongAway;
          $scope.local.gameToDisplay.teamNameHomeToDisplay = $scope.local.game.teamNameLongHome;

        }

      };

      $scope.activate = function () {

        $scope.initializeScopeVariables();

        $scope.fetchGame($scope.gameId);

      };

      $scope.activate();
    }
  ]
);

