'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('lo30ScoringByPeriodController',
  [
    '$scope',
    '$timeout',
    '$routeParams',
    'alertService',
    'dataServiceScoringByPeriod',
    function ($scope, $timeout, $routeParams, alertService, dataServiceScoringByPeriod) {

      $scope.initializeScopeVariables = function () {

        $scope.data = {
          selectedGameId: -1,
          scoringByPeriod: []
        };

        $scope.events = {
          scoringByPeriodLoaded: false
        };

      };

      $scope.getScoringByPeriod = function (gameId) {
        var retrievedType = "ScoringByPeriod";
        var fullDetail = true;
        dataServiceScoringByPeriod.listScoringByPeriodByGameId(gameId).$promise.then(
          function (result) {
            if (result && result.length && result.length > 0) {

              angular.forEach(result, function (item) {
                $scope.data.scoringByPeriod.push(item);
              });

              $scope.events.scoringByPeriodLoaded = true;

              alertService.successRetrieval(retrievedType, $scope.data.scoringByPeriod.length);

            } else {
              alertService.warningRetrieval(retrievedType, "No results returned");
            }
          },
          function (err) {
            alertService.error(retrievedType, err.message);
          }
        );
      };
      
      $scope.setWatches = function () {
      };

      $scope.activate = function () {
        $scope.initializeScopeVariables();
        $scope.setWatches();

        //TODO make this a user selection
        if ($scope.gameId === null) {
          $scope.data.selectedGameId = 3299;
        } else {
          $scope.data.selectedGameId = $scope.gameId;
        }

        $scope.getScoringByPeriod($scope.data.selectedGameId);
      };

      $scope.activate();
    }
  ]
);

