'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('lo30TeamGameRosterController',
  [
    '$scope',
    'externalLibService',
    function ($scope, externalLibService) {
      var _ = externalLibService._;

      $scope.initializeScopeVariables = function () {
        // from directive binding
        // teamGameRosterItems: [],
        // homeTeam: false,

        $scope.data = {
          goalies: [],
          line1: [],
          line2: [],
          line3: []
        };

        $scope.events = {
          teamGameRosterItemsLoaded : false
        };

        $scope.user = {
        };
      };

      $scope.getGoalies = function () {
        $scope.data.goalies = _.filter($scope.teamGameRosterItems, function (item) { return item.rostered.position === 'G'; });
        return;
      };

      $scope.getLine1 = function () {
        $scope.data.line1 = _.filter($scope.teamGameRosterItems, function (item) { return item.rostered.position !== 'G' && item.rostered.line === 1; });
        return;
      };

      $scope.getLine2 = function () {
        $scope.data.line2 = _.filter($scope.teamGameRosterItems, function (item) { return item.rostered.position !== 'G' && item.rostered.line === 2; });
        return;
      };

      $scope.getLine3 = function () {
        $scope.data.line3 = _.filter($scope.teamGameRosterItems, function (item) { return item.rostered.position !== 'G' && item.rostered.line === 3; });
        return;
      };

      $scope.setWatches = function () {
        $scope.$watch('teamGameRosterItems', function (newVal, oldVal) {
          if (newVal && newVal.length && newVal.length > 0) {
            if (!$scope.events.teamGameRosterItemsLoaded) {

              $scope.getGoalies();
              $scope.getLine1();
              $scope.getLine2();
              $scope.getLine3();

              $scope.events.teamGameRosterItemsLoaded = true;
            }
          }
        }, true);
      };

      $scope.activate = function () {
        $scope.initializeScopeVariables();
        $scope.setWatches();
      };

      $scope.activate();
    }
  ]
);

