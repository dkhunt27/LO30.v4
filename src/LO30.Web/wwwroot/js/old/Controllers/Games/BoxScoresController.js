'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('gamesBoxScoresController',
  [
    '$scope',
    '$timeout',
    '$routeParams',
    'alertService',
    'dataServiceGames',
    function ($scope, $timeout, $routeParams, alertService, dataServiceGames) {

      $scope.initializeScopeVariables = function () {

        $scope.data = {
          selectedGameId: -1,
          game: {},
          gameOutcomes: [],
          gameScores: []
          
        };

        $scope.requests = {
          gameLoaded: false,
          gameOutcomeLoaded: false,
          gameScoresLoaded: false
        };

        $scope.user = {
        };
      };

      $scope.getGame = function (gameId) {
        var retrievedType = "Game";

        dataServiceGames.getGameByGameId(gameId).$promise.then(
          function (result) {
            if (result) {
              $scope.data.game = result;
              $scope.requests.gameLoaded = true;
              alertService.successRetrieval(retrievedType, 1);
            } else {
              alertService.warningRetrieval(retrievedType, "No results returned");
            }
          },
          function (err) {
            alertService.errorRetrieval(retrievedType, err.message);
          }
        );
      };

      $scope.setWatches = function () {
      };

      $scope.activate = function () {
        $scope.initializeScopeVariables();
        $scope.setWatches();

        //TODO make this a user selection
        if ($routeParams.gameId === null) {
          $scope.data.selectedGameId = 3299;
        } else {
          $scope.data.selectedGameId = $routeParams.gameId;
        }

        $scope.getGame($scope.data.selectedGameId);
        $timeout(function () {
        }, 0);  // using timeout so it fires when done rendering
      };

      $scope.activate();
    }
  ]
);