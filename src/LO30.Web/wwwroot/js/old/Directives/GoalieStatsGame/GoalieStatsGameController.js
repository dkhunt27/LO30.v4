'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('lo30GoalieStatsGameController',
  [
    '$scope',
    '$timeout',
    'alertService',
    'externalLibService',
    'dataServiceGoalieStatsGame',
    function ($scope, $timeout, alertService, externalLibService, dataServiceGoalieStatsGame) {
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
          goalieStatsGame: [],
          limitTo: 5
        };

        $scope.events = {
          goalieStatsGameProcessing: false,
          goalieStatsGameProcessed: false,
        };

        $scope.user = {
          clickedShowGoalieStatsGame: false
        };
      };

      $scope.setLimitTo5 = function () {
        $scope.data.limitTo = 5;
      };

      $scope.setLimitToAll = function () {
        $scope.data.limitTo = $scope.data.goalieStatsGame.length;
      };

      /*$scope.toggleShowGoalieStatsGame = function () {
        $scope.user.clickedShowGoalieStatsGame = !scope.user.clickedShowGoalieStatsGame;

        if ($scope.user.clickedShowGoalieStatsGame === true) {
          // get data
          $scope.getGoalieStatsGame($scope.playerId, $scope.seasonId, $scope.teamId, $scope.playoffs);
        } else {
          // do nothing
        }
      }*/

      $scope.getGoalieStatsGame = function (playerId, seasonId) {
        var retrievedType = "GoalieStatsGame";

        $scope.events.goalieStatsGameProcessing = true;
        $scope.events.goalieStatsGameProcessed = false;
        $scope.data.goalieStatsGame = [];

        dataServiceGoalieStatsGame.listByPlayerIdSeasonId(playerId, seasonId).$promise.then(
          function (result) {
            // service call on success
            if (result && result.length && result.length > 0) {

              angular.forEach(result, function (item, index) {
                item.game.gameDate = moment(item.game.gameYYYYMMDD, "YYYYMMDD");
                $scope.data.goalieStatsGame.push(item);
              });

              $scope.events.goalieStatsGameProcessing = false;
              $scope.events.goalieStatsGameProcessed = true;

              alertService.successRetrieval(retrievedType, $scope.data.goalieStatsGame.length);
            } else {
              // results not successful
              alertService.errorRetrieval(retrievedType, result.reason);
            }
          }
        );
      };

      $scope.setWatches = function () {
        $scope.$watch('user.ds', function (newVal, oldVal) {
          if (newVal == true) {
            $scope.events.teamRosterLoaded = true;
          }
        }, true);
      };

      $scope.activate = function () {
        $scope.initializeScopeVariables();
        $scope.setWatches();
        $scope.getGoalieStatsGame($scope.playerId, $scope.seasonId);

        $timeout(function () {
          $scope.sortDescFirst('game.gameYYYYMMDD');
        }, 0);  // using timeout so it fires when done rendering
      };

      $scope.activate();
    }
  ]
);

