'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('standingsController',
  function ($scope, apiService, criteriaService, screenSize, broadcastService) {

    $scope.initializeScopeVariables = function () {

      $scope.local = {
        teamStandings: [],
        teamStandingsToDisplay: [],
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

      $scope.$on(broadcastService.events().seasonTypeSet, function () {

        var criteriaSeason = criteriaService.season.get();

        var criteriaSeasonType = criteriaService.seasonType.get();

        var criteriaSeasonTypeBool;

        if (criteriaSeasonType === "Playoffs") {

          criteriaSeasonTypeBool = true;

        } else {

          criteriaSeasonTypeBool = false;

        }

        $scope.fetchTeamStandings(criteriaSeason.seasonId, criteriaSeasonTypeBool);
      });
    };

    $scope.activate = function () {

      $scope.initializeScopeVariables();

      $scope.setWatches();

    };

    $scope.activate();
  }
);