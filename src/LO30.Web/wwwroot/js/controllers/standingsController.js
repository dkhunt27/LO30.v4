'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('standingsController',
  function ($log, $scope, $timeout, $routeParams, apiService, criteriaServiceResolved, screenSize, broadcastService, DTOptionsBuilder, DTColumnBuilder) {

    $scope.initializeScopeVariables = function () {

      $scope.local = {
        teamStandings: [],
        teamStandingsByDiv: [],
        teamStandingsToDisplay: [],
        fetchTeamStandingsCompleted: false,
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

    $scope.fetchTeamStandings = function (seasonId, playoffs) {

      $scope.local.fetchTeamStandingsCompleted = false;

      $scope.local.teamStandings = [];
      $scope.local.teamStandingsByDiv = [];

      apiService.teamStandings.listForSeasonIdPlayoffs(seasonId, playoffs).then(function (fulfilled) {

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

      $scope.local.criteriaSeason = criteriaServiceResolved.season.get();

      $scope.local.criteriaSeasonType = criteriaServiceResolved.seasonType.get();

      $scope.local.criteriaGame = criteriaServiceResolved.game.get();

      var criteriaSeasonTypeBool;

      if ($scope.local.criteriaSeasonType === "Playoffs") {

        criteriaSeasonTypeBool = true;

      } else {

        criteriaSeasonTypeBool = false;

      }

      $scope.fetchTeamStandings($scope.local.criteriaSeason.seasonId, criteriaSeasonTypeBool);
    };

    $scope.setWatches = function () {

      /*$scope.$on(broadcastService.events().seasonSet, function () {

        $scope.fetchData();

      });

      $scope.$on(broadcastService.events().seasonTypeSet, function () {

        $scope.fetchData();

      });*/
    };

    $scope.activate = function () {

      $scope.initializeScopeVariables();

      $scope.setWatches();

      criteriaServiceResolved.season.setById(parseInt($routeParams.seasonId, 10));

      if ($routeParams.seasonTypeId === "1") {

        criteriaServiceResolved.seasonType.set("Playoffs");

      } else {

        criteriaServiceResolved.seasonType.set("Regular Season");

      }

      $scope.fetchData();

      $timeout(function () {
        $scope.sortAscFirst('ranking');
      }, 0); 
    };

    $scope.activate();
  }
);