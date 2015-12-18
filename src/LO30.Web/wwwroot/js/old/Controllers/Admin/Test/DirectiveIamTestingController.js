'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('testDirectiveIamTestingController',
  [
    '$scope',
    'alertService',
    'dataServiceTeamGameRosters',
    'dataServicePlayers',
    'dataServicePlayers',
    function ($scope, alertService, dataServiceTeamGameRosters, dataServicePlayers) {

      $scope.initializeScopeVariables = function () {
        $scope.data = {
          games: [],
          gameIdSelected: -1,
          gameSelected: {},
          homeTeamName: "",
          homeTeamScore: 0,
          homeTeamPims: 0,
          awayTeamName: "",
          awayTeamScore: 0,
          awayTeamPims: 0,
          teamGameRosterHome: [],
          teamGameRosterAway: [],
          scoreSheetEntryScoring: [],
          scoreSheetEntryPenalties: [],
          players: []
        };

        $scope.events = {
          gamesLoaded: false,
          gameSelectedLoaded: false,
          teamGameRosterHomeLoaded: false,
          teamGameRosterAwayLoaded: false,
          scoreSheetEntryScoringLoaded: false,
          scoreSheetEntryPenaltiesLoaded: false,
          playersLoaded: false
        };

        $scope.user = {
          selectedGameId: false
        };
      };

      $scope.getTeamGameRosters = function (gameId, homeTeam) {
        var retrievedType, teamGameRostersLoaded, teamGameRosters;

        if (homeTeam) {
          teamGameRostersLoaded = 'teamGameRosterHomeLoaded';
          teamGameRosters = 'teamGameRosterHome';
          retrievedType = "Home TeamGameRoster";
        } else {
          teamGameRostersLoaded = 'teamGameRosterAwayLoaded';
          teamGameRosters = 'teamGameRosterAway';
          retrievedType = "Away TeamGameRoster";
        }

        $scope.events[teamGameRostersLoaded] = false;
        $scope.data[teamGameRosters] = [];

        dataServiceTeamGameRosters.listTeamGameRosterByGameIdAndHomeTeam(gameId, homeTeam).then(
          function (result) {
            // service call on success
            if (result && result.length && result.length > 0) {

              angular.forEach(result, function (item, index) {
                $scope.data[teamGameRosters].push(item);
              });

              $scope.events[teamGameRostersLoaded] = true;

              alertService.successRetrieval(retrievedType, $scope.data[teamGameRosters].length);
            } else {
              // results not successful
              alertService.errorRetrieval(retrievedType, result.reason);
            }
          }
        );

      };

      $scope.getPlayers = function () {
        var retrievedType = "Players";
        $scope.events.playersLoaded = false;

        dataServicePlayers.listAll().$promise.then(
          function (result) {
            // service call on success
            if (result && result.length && result.length > 0) {

              angular.forEach(result, function (item) {
                $scope.data.players.push(item);
              });
              $scope.events.playersLoaded = true;

              alertService.successRetrieval(retrievedType, $scope.data.players.length);

            } else {
              // results not successful
              alertService.errorRetrieval(retrievedType, result.reason);
            }
          }
        );
      };

      $scope.getPlayerComposites = function () {
        var retrievedType = "PlayerComposites";
        $scope.events.playersLoaded = false;

        var yyyymmdd = 20151129;
        var active = true;

        dataServicePlayers.listPlayerComposites(yyyymmdd, active).$promise.then(
          function (result) {
            // service call on success
            if (result && result.length && result.length > 0) {

              angular.forEach(result, function (item) {
                $scope.data.players.push(item);
              });
              $scope.events.playersLoaded = true;

              alertService.successRetrieval(retrievedType, $scope.data.players.length);

            } else {
              // results not successful
              alertService.errorRetrieval(retrievedType, result.reason);
            }
          }
        );
      };

      $scope.setWatches = function () {
      };

      $scope.activate = function () {
        $scope.initializeScopeVariables();
        $scope.setWatches();

        $scope.data.gameIdSelected = 3402;
        $scope.getTeamGameRosters($scope.data.gameIdSelected, true);
        $scope.getTeamGameRosters($scope.data.gameIdSelected, false);
        //$scope.getPlayers();
        $scope.getPlayerComposites();

      };

      $scope.activate();
    }
  ]
);

