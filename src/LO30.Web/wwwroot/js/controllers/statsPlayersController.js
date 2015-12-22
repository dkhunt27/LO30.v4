'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('statsPlayersController',
    function ($scope, apiService, criteriaService, screenSize, broadcastService, externalLibService) {

      var _ = externalLibService._;

      $scope.initializeScopeVariables = function () {

        $scope.local = {
          playerStatTeams: [],
          playerStatTeamsToDisplay: [],
          fetchPlayerStatTeamsCompleted: false
        };
      };

      $scope.fetchPlayerStatTeams = function (seasonId, playoffs) {

        $scope.local.fetchPlayerStatTeamsCompleted = false;

        $scope.local.playerStatTeams = [];

        apiService.playerStatTeams.listForSeasonIdPlayoffs(seasonId, playoffs).then(function (fulfilled) {

          $scope.local.playerStatTeams = _.sortBy(fulfilled, function(item) { return item.points * -1; });

          $scope.buildPlayerStatTeamsToDisplay();

        }).finally(function () {

          $scope.local.fetchPlayerStatTeamsCompleted = true;

        });
      };

      $scope.buildPlayerStatTeamsToDisplay = function () {


        $scope.local.playerStatTeamsToDisplay = $scope.local.playerStatTeams.map(function (item, index) {

          item.rank = index + 1;

          if (screenSize.is('xs, sm')) {

            item.teamNameToDisplay = item.teamNameCode;
            item.playerNameToDisplay = item.firstName + '<br/>' + item.lastName;

            if (item.suffix) {
              item.playerNameToDisplay = item.playerNameToDisplay + ' ' + item.suffix;
            }

          } else if (screenSize.is('md')) {

            item.teamNameToDisplay = item.teamNameShort;
            item.playerNameToDisplay = item.firstName + '<br/>' + item.lastName;

            if (item.suffix) {
              item.playerNameToDisplay = item.playerNameToDisplay + ' ' + item.suffix;
            }

          } else {

            item.teamNameToDisplay = item.teamNameShort;
            item.playerNameToDisplay = item.firstName + ' ' + item.lastName;

            if (item.suffix) {
              item.playerNameToDisplay = item.playerNameToDisplay + ' ' + item.suffix;
            }

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

          $scope.fetchPlayerStatTeams(criteriaSeason.seasonId, criteriaSeasonTypeBool);
        });
      };

      $scope.activate = function () {

        $scope.initializeScopeVariables();

        $scope.setWatches();

      };

      $scope.activate();
    }
);