'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('scoreSheetsEntryController',
  [
    '$scope',
    '$routeParams',
    'alertService',
    'dataServiceGames',
    'dataServicePlayers',
    'dataServiceTeamGameRosters',
    'dataServiceScoreSheetEntryProcessedPenalties',
    function ($scope, $routeParams, alertService, dataServiceGames, dataServicePlayers, dataServiceTeamGameRosters, dataServiceScoreSheetEntryProcessedPenalties) {

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
      }
      
      $scope.isTeamGameRosterLocked = function () {
        var locked = true;

        // if user is admin, should be editable/not locked

        // otherwise, if game data hasn't been processed...then it is editable/not locked
        if ($scope.data.teamGameRosterHome && $scope.data.teamGameRosterHome.length > 0) {
          locked = $scope.data.teamGameRosterHome[0].gameProcessed;
        }

        return locked;
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

      $scope.getScoreSheetEntryPenalties = function (gameId, fullDetail) {
        var retrievedType = "ScoreSheetEntryPenalties";

        $scope.events.scoreSheetEntryPenaltiesLoaded = false;
        $scope.data.scoreSheetEntryPenalties = [];

        dataServiceScoreSheetEntryProcessedPenalties.listByGameId(gameId, fullDetail).$promise.then(
          function (result) {
            // service call on success
            if (result) {

              angular.forEach(result, function (item, index) {
                $scope.data.scoreSheetEntryPenalties.push(item);
              });

              $scope.events.scoreSheetEntryPenaltiesLoaded = true;

              alertService.successRetrieval(retrievedType, $scope.data.scoreSheetEntryPenalties.length);
            } else {
              // results not successful
              alertService.errorRetrieval(retrievedType, result.reason);
            }
          }
        );
      };

      $scope.getGames = function () {
        var retrievedType = "Games";
        $scope.events.gamesLoaded = false;
        $scope.events.gameSelectedLoaded = false;

        dataServiceGames.listGames().$promise.then(
          function (result) {
            // service call on success
            if (result && result.length && result.length > 0) {

              angular.forEach(result, function (item) {
                $scope.data.games.push(item);
              });
              $scope.events.gamesLoaded = true;

              alertService.successRetrieval(retrievedType, $scope.data.games.length);

              $scope.data.gameSelected = _.find($scope.data.games, function (item) { return item.gameId.toString() === $scope.data.gameIdSelected });

              $scope.events.gameSelectedLoaded = true;

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

      $scope.setWatches = function () {
        $scope.$watch('events.gameSelectedLoaded', function (val) {
          if (val === true) {
            $scope.getTeamGameRosters($scope.data.gameIdSelected, true);
            $scope.getTeamGameRosters($scope.data.gameIdSelected, false);
          }
        });
      }

      $scope.activate = function () {
        $scope.initializeScopeVariables();
        $scope.setWatches();

        $scope.data.gameIdSelected = $routeParams.gameId;
        $scope.user.selectedGameId = true;
        
        $scope.getGames();
      };

      $scope.activate();
    }
  ]
);

