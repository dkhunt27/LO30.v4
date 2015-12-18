'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('lo30GoalieStatsSeasonController',
  [
    '$scope',
    'alertService',
    'externalLibService',
    'dataServiceGoalieStatsSeason',
    function ($scope, alertService, externalLibService, dataServiceGoalieStatsSeason) {
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
          goalieStatsSeason: []
        };

        $scope.events = {
          goalieStatsSeasonProcessing: false,
          goalieStatsSeasonProcessed: false,
        };

        $scope.user = {
        };
      };

      $scope.getGoalieStatsSeason = function (playerId, seasonId) {
        var retrievedType = "GoalieStatsSeason";

        $scope.events.goalieStatsSeasonProcessing = true;
        $scope.events.goalieStatsSeasonProcessed = false;
        $scope.data.goalieStatsSeason = [];

        dataServiceGoalieStatsSeason.listByPlayerIdSeasonId(playerId, seasonId).$promise.then(
          function (result) {
            // service call on success
            if (result && result.length && result.length > 0) {

              angular.forEach(result, function (item, index) {
                var name;
                if (item.playoffs === true) {
                  name = "Playoffs"
                } else {
                  name = "Regular Season"
                }

                if (item.sub === true) {
                  name = name + "*";
                } 

                item.name = name;

                $scope.data.goalieStatsSeason.push(item);
              });

              $scope.events.goalieStatsSeasonProcessing = false;
              $scope.events.goalieStatsSeasonProcessed = true;

              alertService.successRetrieval(retrievedType, $scope.data.goalieStatsSeason.length);
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
        $scope.getGoalieStatsSeason($scope.playerId, $scope.seasonId);
      };

      $scope.activate();
    }
  ]
);

