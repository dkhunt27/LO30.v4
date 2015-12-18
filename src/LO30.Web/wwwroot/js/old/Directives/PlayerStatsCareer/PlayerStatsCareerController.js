'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('lo30PlayerStatsCareerController',
  [
    '$log',
    '$scope',
    'alertService',
    'externalLibService',
    'dataServicePlayerStatsCareer',
    function ($log, $scope, alertService, externalLibService, dataServicePlayerStatsCareer) {
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
          playerStatsCareer: {}
        };

        $scope.events = {
          playerStatsCareerProcessing: false,
          playerStatsCareerProcessed: false,
        };
      };

      $scope.getPlayerStatsCareer = function (playerId) {
        var retrievedType = "PlayerStatsCareer";

        $scope.events.playerStatsCareerProcessing = true;
        $scope.events.playerStatsCareerProcessed = false;
        $scope.data.playerStatsCareer = {};

        dataServicePlayerStatsCareer.getByPlayerId(playerId).then(
          function (fulfilled) {
            // service call on success
            if (fulfilled) {

              $scope.data.playerStatsCareer = fulfilled;

              $scope.events.playerStatsCareerProcessing = false;
              $scope.events.playerStatsCareerProcessed = true;

              alertService.successRetrieval(retrievedType, 1);

              $log.debug(retrievedType, fulfilled);

            } else {
              // results not successful
              alertService.errorRetrieval(retrievedType, fulfilled.reason);
            }
          },
          function (rejected) {
            alertService.errorRetrieval(retrievedType, rejected);
          }
        );
      };

      $scope.activate = function () {
        $scope.initializeScopeVariables();
        $scope.getPlayerStatsCareer($scope.playerId);
      };

      $scope.activate();
    }
  ]
);

