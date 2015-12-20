'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('standingsController',
  function ($log, $scope, $timeout, $routeParams, apiService, criteriaServiceResolved, screenSize, externalLibService) {

    var _ = externalLibService._;

    $scope.initializeScopeVariables = function () {

      $scope.local = {
        teamStandings: [],
        fetchTeamStandingsCompleted: false
      };
    };

    $scope.fetchTeamStandings = function (seasonId, playoffs) {

      $scope.local.fetchTeamStandingsCompleted = false;

      $scope.local.teamStandings = [];

      apiService.teamStandings.listForSeasonIdPlayoffs(seasonId, playoffs).then(function (fulfilled) {

        $scope.local.teamStandings = fulfilled;

        $scope.buildTeamStandingsToDisplay();

      }).finally(function () {

        $scope.local.fetchTeamStandingsCompleted = true;

      });
    };

    $scope.buildTeamStandingsToDisplay = function () {

      $scope.local.teamStandingsToDisplay = $scope.local.teamStandings.map(function (item) {

        if (screenSize.is('xs, sm')) {

          item.teamNameToDisplay = item.teamNameCode;

        } else if (screenSize.is('md')) {

          item.teamNameToDisplay = item.teamNameShort;

        } else {

          item.teamNameToDisplay = item.teamNameLong;

        }

        return item;
      });
    };

    $scope.setWatches = function () {

      //$scope.$watch('criteriaService.season', function (newVal, oldVal) {

      //  if (sjv.isNotEmpty(newVal) && newVal !== oldVal) {

      //    $scope.fetchGames($scope.local.selectedSeason.seasonId);
      //    $scope.fetchLastProcessedGameId($scope.local.selectedSeason.seasonId);

      //  }
      //});
    };

    $scope.activate = function () {

      $scope.initializeScopeVariables();

      $scope.setWatches();

      var criteriaSeason = criteriaServiceResolved.season.get();

      $scope.fetchTeamStandings(criteriaSeason.seasonId, false);
    };

    $scope.activate();
  }
);