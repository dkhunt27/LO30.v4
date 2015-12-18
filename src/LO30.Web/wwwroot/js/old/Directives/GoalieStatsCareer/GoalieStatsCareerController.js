'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('lo30GoalieStatsCareerController',
  [
    '$scope',
    'alertService',
    'externalLibService',
    'dataServiceGoalieStatsCareer',
    'dataServiceGoalieStatsSeason',
    function ($scope, alertService, externalLibService, dataServiceGoalieStatsCareer, dataServiceGoalieStatsSeason) {
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
          goalieStatsCareer: {}
        };

        $scope.events = {
          goalieStatsCareerProcessing: false,
          goalieStatsCareerProcessed: false,
        };
      };

      $scope.getGoalieStatsCareer = function (playerId, playoffs) {
        var retrievedType = "GoalieStatsCareer";

        $scope.events.goalieStatsCareerProcessing = true;
        $scope.events.goalieStatsCareerProcessed = false;
        $scope.data.goalieStatsCareer = {};

        dataServiceGoalieStatsCareer.getByPlayerIdPlayoffs(playerId, playoffs).$promise.then(
          function (result) {
            // service call on success
            if (result) {

              $scope.data.goalieStatsCareer = result;

              $scope.events.goalieStatsCareerProcessing = false;
              $scope.events.goalieStatsCareerProcessed = true;

              alertService.successRetrieval(retrievedType, 1);
            } else {
              // results not successful
              alertService.errorRetrieval(retrievedType, result.reason);
            }
          }
        );
      };

      $scope.getGoalieStatsCareerViaSeasons = function (playerId, playoffs) {
        var retrievedType = "GoalieStatsCareerViaSeasons";

        $scope.events.goalieStatsCareerProcessing = true;
        $scope.events.goalieStatsCareerProcessed = false;
        $scope.data.goalieStatsCareer = {};

        dataServiceGoalieStatsSeason.listByPlayerId(playerId).$promise.then(
          function (result) {
            // service call on success
            if (result && result.length && result.length > 0) {

              var career = {
                playerId: playerId,
                playoffs: playoffs,
                games: 0,
                goals: 0,
                assists: 0,
                points: 0,
                penaltyMinutes: 0,
                powerPlayGoals: 0,
                shortHandedGoals: 0,
                GameWinningGoals: 0
              };

              angular.forEach(result, function (item, index) {
                if (item.playoffs == playoffs) {
                  career.games = career.games + item.games;
                  career.goals = career.goals + item.goals;
                  career.assists = career.assists + item.assists;
                  career.points = career.points + item.points;
                  career.penaltyMinutes = career.penaltyMinutes + item.penaltyMinutes;
                  career.powerPlayGoals = career.powerPlayGoals + item.powerPlayGoals;
                  career.shortHandedGoals = career.shortHandedGoals + item.shortHandedGoals;
                  career.GameWinningGoals = career.GameWinningGoals + item.GameWinningGoals;
                }
              });

              $scope.data.goalieStatsCareer = career;

              $scope.events.goalieStatsCareerProcessing = false;
              $scope.events.goalieStatsCareerProcessed = true;

              alertService.successRetrieval(retrievedType, 1);
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
        //$scope.getGoalieStatsCareer($scope.playerId, $scope.playoffs);
        $scope.getGoalieStatsCareerViaSeasons($scope.playerId, $scope.playoffs);
      };

      $scope.activate();
    }
  ]
);

