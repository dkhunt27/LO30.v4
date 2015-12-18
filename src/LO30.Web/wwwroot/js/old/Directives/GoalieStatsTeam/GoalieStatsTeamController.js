'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('lo30GoalieStatsTeamController',
  [
    '$scope',
    'alertService',
    'externalLibService',
    'dataServiceGoalieStatsTeam',
    function ($scope, alertService, externalLibService, dataServiceGoalieStatsTeam) {
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
          goalieStatsTeam: []
        };

        $scope.events = {
          goalieStatsTeamProcessing: false,
          goalieStatsTeamProcessed: false,
        };

        $scope.user = {
        };
      };

      $scope.getGoalieStatsTeam = function (playerId, playoffs) {
        var retrievedType = "GoalieStatsTeam";

        $scope.events.goalieStatsTeamProcessing = true;
        $scope.events.goalieStatsTeamProcessed = false;
        $scope.data.goalieStatsTeam = [];

        dataServiceGoalieStatsTeam.listByPlayerId(playerId).$promise.then(
          function (result) {
            // service call on success
            if (result && result.length && result.length > 0) {

              angular.forEach(result, function (item, index) {
                if (item.playoffs === playoffs) {
                  $scope.data.goalieStatsTeam.push(item);
                }
              });

              $scope.events.goalieStatsTeamProcessing = false;
              $scope.events.goalieStatsTeamProcessed = true;

              alertService.successRetrieval(retrievedType, $scope.data.goalieStatsTeam.length);
            } else {
              // results not successful
              alertService.errorRetrieval(retrievedType, result.reason);
            }
          }
        );
      };

      $scope.setWatches = function () {
      };

      $scope.activate = function () {
        $scope.initializeScopeVariables();
        $scope.setWatches();
        $scope.getGoalieStatsTeam($scope.playerId, $scope.playoffs);
      };

      $scope.activate();
    }
  ]
);

