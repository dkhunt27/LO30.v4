'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('lo30PlayerStatsSeasonController',
  [
    '$log',
    '$scope',
    '$timeout',
    'alertService',
    'externalLibService',
    'dataServicePlayerStatsSeason',
    function ($log, $scope, $timeout, alertService, externalLibService, dataServicePlayerStatsSeason) {
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
          playerStatsSeason: []
        };

        $scope.events = {
          playerStatsSeasonProcessing: false,
          playerStatsSeasonProcessed: false,
        };

        $scope.user = {
        };
      };

      $scope.getPlayerStatsSeason = function (playerId, seasonId) {
        var retrievedType = "PlayerStatsSeason";

        $scope.events.playerStatsSeasonProcessing = true;
        $scope.events.playerStatsSeasonProcessed = false;
        $scope.data.playerStatsSeason = [];

        dataServicePlayerStatsSeason.listByPlayerIdSeasonId(playerId, seasonId).$promise.then(
          function (fulfilled) {
            // service call on success
            if (fulfilled && fulfilled.length && fulfilled.length > 0) {

              angular.forEach(fulfilled, function (item, index) {
                var type;
                if (item.playoffs === true) {
                  type = "Playoffs"
                } else {
                  type = "Regular Season"
                }

                var name = item.season.seasonName + " " + type;

                if (item.sub === true) {
                  name = name + "*";
                } 

                item.name = name;
                item.type = type;

                $scope.data.playerStatsSeason.push(item);
              });

              $scope.events.playerStatsSeasonProcessing = false;
              $scope.events.playerStatsSeasonProcessed = true;

              alertService.successRetrieval(retrievedType, $scope.data.playerStatsSeason.length);

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
        $scope.getPlayerStatsSeason($scope.playerId, $scope.seasonId);

        $timeout(function () {
          $scope.sortDescFirst('name');
        }, 0);  // using timeout so it fires when done rendering
      };

      $scope.activate();
    }
  ]
);

