'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('standingsController',
  function ($log, $scope, $timeout, $state, $stateParams, apiService, screenSize, criteriaService, broadcastService, returnUrlService) {

    $scope.initializeScopeVariables = function () {

      $scope.local = {
        teamStandings: [],
        teamStandingsByDiv: [],
        teamStandingsToDisplay: [],
        fetchTeamStandingsCompleted: false,

        criteriaSeasonId: -1,
        criteriaSeasonTypeId: -1
      };  
    };

    $scope.sortAscOnly = function (column) {
      $scope.sortOn = column;
      $scope.sortDirection = false;
    };

    $scope.sortDescOnly = function (column) {
      $scope.sortOn = column;
      $scope.sortDirection = true;
    };

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

    $scope.sortClass = function (column, sortDirection) {

      var ngClass = "";

      if ($scope.sortOn === column) {
        if ($scope.sortDirection === true) {
          ngClass = "fa fa-sort-desc";
        } else {
          ngClass = "fa fa-sort-asc";
        }
      } 

      return ngClass;
    }

    $scope.fetchTeamStandings = function (seasonId, seasonTypeId) {

      $scope.local.fetchTeamStandingsCompleted = false;

      $scope.local.teamStandings = [];
      $scope.local.teamStandingsByDiv = [];

      apiService.teamStandings.listForSeasonIdSeasonTypeId(seasonId, seasonTypeId).then(function (fulfilled) {

        $scope.local.teamStandings = fulfilled;

        $scope.buildTeamStandingsToDisplay($scope.local.teamStandings);

        $scope.parseTeamStandingsIntoDivisions($scope.local.teamStandingsToDisplay);

      }).finally(function () {

        $scope.local.fetchTeamStandingsCompleted = true;

      });
    };

    $scope.parseTeamStandingsIntoDivisions = function (teamStandings) {
      var divisions = _.pluck(teamStandings, "divisionLongName");
      var uniqDivs = _.uniq(divisions);

      uniqDivs.forEach(function (division) {

        var teamStandingsDiv = _.filter(teamStandings, function (item) { return item.divisionLongName === division; })

        $scope.local.teamStandingsByDiv.push({ division: division, teamStandings: teamStandingsDiv });

      });

      $log.debug("teamStandingsByDiv", $scope.local.teamStandingsByDiv);
    };

    $scope.buildTeamStandingsToDisplay = function (teamStandings) {

      $scope.local.teamStandingsToDisplay = teamStandings.map(function (item) {

        if (screenSize.is('xs, sm')) {

          item.teamNameToDisplay = item.teamCode;

        } else if (screenSize.is('md')) {

          item.teamNameToDisplay = item.teamNameShort;

        } else {

          item.teamNameToDisplay = item.teamNameLong;

        }

        return item;
      });

      $log.debug("teamStandingsToDisplay", $scope.local.teamStandingsToDisplay)
    };

    $scope.fetchData = function () {

      var seasonId = criteriaService.seasonId.get();

      var seasonTypeId = criteriaService.seasonTypeId.get();

      $scope.fetchTeamStandings(seasonId, seasonTypeId);

    };

    $scope.setWatches = function () {
      $scope.$on(broadcastService.events().seasonSet, function () {

        $scope.fetchData();

      });

      $scope.$on(broadcastService.events().seasonTypeSet, function () {

        $scope.fetchData();

      }); 
    };

    $scope.setReturnUrlForCriteriaSelector = function () {

      var currentUrl = $state.href($state.current.name, $state.params, { absolute: false });

      returnUrlService.set(currentUrl);

    };

    $scope.activate = function () {

      $scope.initializeScopeVariables();

      $scope.setWatches();

      $scope.setReturnUrlForCriteriaSelector();

      $scope.fetchData();

      $timeout(function () {
        $scope.sortAscFirst('ranking');
      }, 0); 
    };

    $scope.activate();
  }
);