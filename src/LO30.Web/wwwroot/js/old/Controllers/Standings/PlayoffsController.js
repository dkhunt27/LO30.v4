'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('standingsPlayoffsController',
  [
    '$scope',
    '$timeout',
    'alertService',
    'dataServiceForWebTeamStandings',
    'constCurrentSeasonId',
    function ($scope, $timeout, alertService, dataServiceForWebTeamStandings, constCurrentSeasonId) {

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
          seasonId: constCurrentSeasonId,
          playoffs: true,
          teamStandings: [],
          teamStandingsByDiv: [],
          teamStandingsDataGoodThru: "n/a"
        };

        $scope.requests = {
          teamStandingsLoaded: false,
          teamStandingsByDivLoaded: false,
          teamStandingsDataGoodThruLoaded: false
        };

        $scope.user = {
        };
      };

      $scope.getForWebTeamStandings = function () {
        var retrievedType = "TeamStandings";

        $scope.initializeScopeVariables();

        dataServiceForWebTeamStandings.listForWebTeamStandings($scope.data.seasonId, $scope.data.playoffs).$promise.then(
          function (result) {
            // service call on success
            if (result && result.length && result.length > 0) {

              angular.forEach(result, function (item) {
                if (item.pfs === true) {
                  $scope.data.teamStandings.push(item);
                }
              });

              $scope.requests.teamStandingsLoaded = true;

              alertService.successRetrieval(retrievedType, $scope.data.teamStandings.length);

            } else {
              // results not successful
              alertService.errorRetrieval(retrievedType, result.reason);
            }
          }
        );

        dataServiceForWebTeamStandings.getForWebTeamStandingsDataGoodThru($scope.data.seasonId).$promise.then(
          function (result) {
            // service call on success
            if (result && result.gt) {

              $scope.data.teamStandingsDataGoodThru = result.gt;
              $scope.requests.teamStandingsDataGoodThruLoaded = true;

              alertService.successRetrieval("TeamStandingsGoodThru", 1);

            } else {
              // results not successful
              alertService.errorRetrieval("TeamStandingsGoodThru", result.reason);
            }
          }
        );
      };

      $scope.parseTeamStandingsIntoDivisions = function () {
        var divisions = _.pluck($scope.data.teamStandings, "div");
        var uniqDivs = _.uniq(divisions);

        uniqDivs.forEach(function (division) {
          var teamStandingsDiv = _.filter($scope.data.teamStandings, function (item) { return item.div === division; })
          $scope.data.teamStandingsByDiv.push({ division: division, teamStandings: teamStandingsDiv });
        });
      };

      $scope.setWatches = function () {
        $scope.$watch('requests.teamStandingsLoaded', function (newVal, oldVal) {
          if (newVal === true) {
            $scope.parseTeamStandingsIntoDivisions();
          }
        }, true);
      };

      $scope.activate = function () {
        $scope.initializeScopeVariables();
        $scope.setWatches();
        $scope.getForWebTeamStandings();
        $timeout(function () {
          $scope.sortAscOnly('ranking');
        }, 0);  // using timeout so it fires when done rendering
      };

      $scope.activate();
    }
  ]
);