'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('gameBoxScoreController',
    function ($scope, $routeParams, criteriaServiceResolved, broadcastService, externalLibService) {

      var _ = externalLibService._;

      $scope.initializeScopeVariables = function () {

        $scope.local = {
          selectedGameId: 3480,
          selectedSeasonId: 56
        };
      };


      $scope.setWatches = function () {

      };

      $scope.activate = function () {

        $scope.initializeScopeVariables();

        $scope.setWatches();

        if ($routeParams.seasonId) {

          $scope.local.selectedSeasonId = parseInt($routeParams.seasonId, 10);

          criteriaServiceResolved.season.setById($scope.local.selectedSeasonId);
        }

        if ($routeParams.gameId) {

          $scope.local.selectedGameId = parseInt($routeParams.gameId, 10);

          criteriaServiceResolved.game.setById($scope.local.selectedGameId);
        }

      };

      $scope.activate();
    }
);