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
          fetchGameCompleted: false
        };
      };


      $scope.fetchGame = function (gameId) {

        $scope.local.fetchGameCompleted = false;

        $scope.game = {};

        apiService.games.getForGameId(gameId).then(function (fulfilled) {

          $scope.game = fulfilled;

          $scope.buildGameToDisplay();

        }).finally(function () {

          $scope.local.fetchPlayerStatGamesCompleted = true;

        });
      };

      $scope.buildGameToDisplay = function () {

        $scope.local.gameToDisplay = _.clone($scope.game);

        if (screenSize.is('xs, sm')) {

          $scope.local.gameToDisplay.teamNameAwayToDisplay = $scope.game.teamCodeAway;
          $scope.local.gameToDisplay.teamNameHomeToDisplay = $scope.game.teamCodeHome;

        } else if (screenSize.is('md')) {

          $scope.local.gameToDisplay.teamNameAwayToDisplay = $scope.game.teamNameShortAway;
          $scope.local.gameToDisplay.teamNameHomeToDisplay = $scope.game.teamNameShortHome;

        } else {

          $scope.local.gameToDisplay.teamNameAwayToDisplay = $scope.game.teamNameLongAway;
          $scope.local.gameToDisplay.teamNameHomeToDisplay = $scope.game.teamNameLongHome;

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

