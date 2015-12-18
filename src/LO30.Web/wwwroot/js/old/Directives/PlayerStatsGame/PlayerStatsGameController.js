'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('lo30PlayerStatsGameController',
  [
    '$log',
    '$scope',
    '$timeout',
    'alertService',
    'externalLibService',
    'dataServicePlayerStatsGame',
    function ($log, $scope, $timeout, alertService, externalLibService, dataServicePlayerStatsGame) {
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
          playerStatsGame: [],
          limitTo: 5
        };

        $scope.events = {
          playerStatsGameProcessing: false,
          playerStatsGameProcessed: false,
        };

        $scope.user = {
          clickedShowPlayerStatsGame: false
        };
      };

      $scope.setLimitTo5 = function () {
        $scope.data.limitTo = 5;
      };

      $scope.setLimitToAll = function () {
        $scope.data.limitTo = $scope.data.playerStatsGame.length;
      };

      /*$scope.toggleShowPlayerStatsGame = function () {
        $scope.user.clickedShowPlayerStatsGame = !scope.user.clickedShowPlayerStatsGame;

        if ($scope.user.clickedShowPlayerStatsGame === true) {
          // get data
          $scope.getPlayerStatsGame($scope.playerId, $scope.seasonId, $scope.teamId, $scope.playoffs);
        } else {
          // do nothing
        }
      }*/

      $scope.getPlayerStatsGame = function (playerId, seasonId) {
        var retrievedType = "PlayerStatsGame";

        $scope.events.playerStatsGameProcessing = true;
        $scope.events.playerStatsGameProcessed = false;
        $scope.data.playerStatsGame = [];

        dataServicePlayerStatsGame.listByPlayerIdSeasonId(playerId, seasonId).$promise.then(
          function (fulfilled) {
            // service call on success
            if (fulfilled && fulfilled.length && fulfilled.length > 0) {

              angular.forEach(fulfilled, function (item, index) {
                item.game.gameDate = moment(item.game.gameYYYYMMDD, "YYYYMMDD");
                $scope.data.playerStatsGame.push(item);
              });

              $scope.events.playerStatsGameProcessing = false;
              $scope.events.playerStatsGameProcessed = true;

              alertService.successRetrieval(retrievedType, $scope.data.playerStatsGame.length);

              $log.debug(retrievedType, fulfilled);
            } else {
              // results not successful
              alertService.errorRetrieval(retrievedType, fulfilled.reason);
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
        $scope.getPlayerStatsGame($scope.playerId, $scope.seasonId);

        $timeout(function () {
          $scope.sortDescFirst('game.gameDate');
        }, 0);  // using timeout so it fires when done rendering
      };

      $scope.activate();
    }
  ]
);

