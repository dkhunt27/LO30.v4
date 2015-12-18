'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('playersPlayerController',
  [
    '$scope',
    '$timeout',
    '$routeParams',
    'alertService',
    'externalLibService',
    'dataServicePlayers',
    'constCurrentSeasonId',
    function ($scope, $timeout, $routeParams, alertService, externalLibService, dataServicePlayers, constCurrentSeasonId) {
      var sjv = externalLibService.sjv;

      $scope.initializeScopeVariables = function () {

        $scope.data = {
          selectedPlayerId: -1,
          selectedSeasonId: -1,
          player: {}
        };

        $scope.requests = {
          playerLoaded: false
        };

        $scope.user = {
        };
      };

      $scope.getPlayer = function (playerId) {
        var retrievedType = "Player";

        dataServicePlayers.getByPlayerId(playerId).$promise.then(
          function (result) {
            if (result) {

              $scope.data.player = result;
              $scope.requests.playerLoaded = true;
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

      $scope.getAnotherPlayer = function () {

        $scope.initializeScopeVariables();

        //TODO make this a user selection
        $scope.data.selectedPlayerId = 593;
        $scope.getPlayer($scope.data.selectedPlayerId);
      };

      $scope.setWatches = function () {
      };

      $scope.activate = function () {
        $scope.initializeScopeVariables();
        $scope.setWatches();

        //TODO make this a user selection
        if (sjv.isEmpty($routeParams.playerId)) {
          $scope.data.selectedPlayerId = 593;
          //$scope.data.selectedPlayerId = 631;
        } else {
          $scope.data.selectedPlayerId = $routeParams.playerId;
        }

        //TODO make this a user selection
        if (sjv.isEmpty($routeParams.seasonId)) {
          $scope.data.selectedSeasonId = constCurrentSeasonId;
        } else {
          $scope.data.selectedSeasonId = $routeParams.seasonId;
        }

        $scope.getPlayer($scope.data.selectedPlayerId);
      };

      $scope.activate();
    }
  ]
);