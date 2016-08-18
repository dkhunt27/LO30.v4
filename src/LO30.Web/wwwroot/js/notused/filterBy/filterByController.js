'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('lo30FilterByController',
  [
    '$log',
    '$scope',
    'externalLibService',
    'apiService',
    'screenSize',
    function ($log, $scope, externalLibService, apiService, screenSize) {

      var _ = externalLibService._;

      $scope.initializeScopeVariables = function () {

        $scope = {

          teams: [],

          fetchTeamsCompleted: false
        };
      };


      $scope.fetchTeams = function (seasonId) {

        $scope.local.fetchTeamsCompleted = false;

        $scope.local.teams = [];

        apiService.teams.listForSeasonId(seasonId).then(function (fulfilled) {

          $scope.local.teams = fulfilled;

          angular.forEach(fulfilled, function (item, index) {

            if (screenSize.is('xs, sm')) {

              item.teamNameToDisplay = item.teamCode;

            } else if (screenSize.is('md')) {

              item.teamNameToDisplay = item.teamNameShort;

            } else {

              item.teamNameToDisplay = item.teamNameShort;

            }

          });

        }).finally(function () {

          $scope.local.fetchScoreSheetEntryGoalsCompleted = true;

        });
      };

      $scope.activate = function () {
      
        $scope.initializeScopeVariables();

        $scope.fetchTeams($scope.seasonId);

      };

      $scope.activate();
    }
  ]
);

