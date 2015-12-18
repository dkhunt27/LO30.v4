'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('lo30PlayerStatsTeamController',
  [
    '$log',
    '$scope',
    'alertService',
    'externalLibService',
    'dataServicePlayerStatsTeam',
    function ($log, $scope, alertService, externalLibService, dataServicePlayerStatsTeam) {
      var _ = externalLibService._;

      $scope.sortAscFirst = function (column) {
        if ($scope.sortOn === column) {
          $scope.sortDirection = !$scope.sortDirection;
        } else {
          $scope.sortOn = column;
          $scope.sortDirection = false;
        }
      };

      $scope.sortDescFirst = function (column) {
        if ($scope.sortOn === column) {
          $scope.sortDirection = !$scope.sortDirection;
        } else {
          $scope.sortOn = column;
          $scope.sortDirection = true;
        }
      };

      $scope.sortAscOnly = function (column) {
        $scope.sortOn = column;
        $scope.sortDirection = false;
      };

      $scope.sortDescOnly = function (column) {
        $scope.sortOn = column;
        $scope.sortDirection = true;
      };

      $scope.initializeScopeVariables = function () {

        $scope.data = {
          playerStatsTeam: []
        };

        $scope.events = {
          playerStatsTeamProcessing: false,
          playerStatsTeamProcessed: false,
        };

        $scope.user = {
        };
      };

      $scope.getPlayerStatsTeam = function (playerId, seasonId) {
        var retrievedType = "PlayerStatsTeam";

        $scope.events.playerStatsTeamProcessing = true;
        $scope.events.playerStatsTeamProcessed = false;
        $scope.data.playerStatsTeam = [];

        dataServicePlayerStatsTeam.listByPlayerIdSeasonId(playerId, seasonId).$promise.then(
          function (fulfilled) {
            // service call on success
            if (fulfilled && fulfilled.length && fulfilled.length > 0) {

              $scope.data.playerStatsTeam = fulfilled;

              $scope.events.playerStatsTeamProcessing = false;
              $scope.events.playerStatsTeamProcessed = true;

              alertService.successRetrieval(retrievedType, $scope.data.playerStatsTeam.length);

              $log.debug(retrievedType, fulfilled);
            } else {
              // results not successful
              alertService.errorRetrieval(retrievedType, fulfilled.reason);
            }
          }
        );
      };

      $scope.setWatches = function () {
      };

      $scope.activate = function () {
        $scope.initializeScopeVariables();
        $scope.setWatches();
        $scope.getPlayerStatsTeam($scope.playerId, $scope.seasonId);
      };

      $scope.activate();
    }
  ]
);

