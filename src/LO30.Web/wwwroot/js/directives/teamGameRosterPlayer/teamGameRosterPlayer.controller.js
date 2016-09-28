'use strict';

angular.module('lo30NgApp')
  .controller('lo30TeamGameRosterPlayerController',
  [
    '$scope',
    'externalLibService',
    function ($scope, externalLibService) {
      var _ = externalLibService._;

      $scope.initializeScopeVariables = function () {
        // from directive binding
        // teamGameRosterItem: {}

        $scope.data = {
          selectedSub: {}
        };

        $scope.events = {
          rosteredProcessed: false,
          subbedProcessed: false,
          gameRosterPlayerProcessing: false,
          gameRosterPlayerProcessed: false,
        };

        $scope.user = {
          clickedAddSub: false
        };
      };

      $scope.toggleRosteredWasSubbedFor = function (teamGameRosterItem) {
        if (teamGameRosterItem.rosteredWasSubbedFor === true) {
          $scope.user.clickedAddSub = true;
        } else {
          $scope.user.clickedAddSub = false;
        }
      }

      $scope.setWatches = function () {
        /*$scope.$watch('user.clickedAddSub', function (newVal, oldVal) {
          if (newVal) {
            $scope.events.teamRosterLoaded = true;
          }
        });*/
      };

      $scope.activate = function () {
        $scope.initializeScopeVariables();
        $scope.setWatches();
      };

      $scope.activate();
    }
  ]
);

