'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('lo30ScoringDetailController',
  [
    '$scope',
    'alertService',
    'externalLibService',
    'dataServiceScoreSheetEntryProcessedScoring',
    'dataServiceScoreSheetEntryProcessedPenalties',
    'dataServiceGoalieStatsGame',
    function ($scope, alertService, externalLibService, dataServiceScoreSheetEntryProcessedScoring, dataServiceScoreSheetEntryProcessedPenalties, dataServiceGoalieStatsGame) {
      var _ = externalLibService._;

      $scope.initializeScopeVariables = function () {
        // from directive binding
        // gameId
        // locked

        $scope.data = {
          scoreSheetEntryScoring: [],
          scoreSheetEntryScoring1st: [],
          scoreSheetEntryScoring2nd: [],
          scoreSheetEntryScoring3rd: [],
          scoreSheetEntryScoringOT: [],
          scoreSheetEntryPenalties: [],
          scoreSheetEntryPenalties1st: [],
          scoreSheetEntryPenalties2nd: [],
          scoreSheetEntryPenalties3rd: [],
          scoreSheetEntryPenaltiesOT: [],
          goalieStatsGame: [],
          goalieStatsGameWinner: {},
          goalieStatsGameLoser: {},
          timeElapsedSortBy: false
        };

        $scope.events = {
          scoreSheetEntryScoringLoaded: false,
          scoreSheetEntryPenaltiesLoaded: false,
          goalieStatsGameLoaded: false
        };

        $scope.user = {
        };
      };

      $scope.getScoreSheetEntryScoring = function (gameId, fullDetail) {
        var retrievedType = "ScoreSheetEntryScoring";

        $scope.events.scoreSheetEntryScoringLoaded = false;
        $scope.data.scoreSheetEntryScoring = [];

        dataServiceScoreSheetEntryProcessedScoring.listByGameId(gameId, fullDetail).$promise.then(
          function (result) {
            // service call on success
            if (result) {

              angular.forEach(result, function (item, index) {
                $scope.data.scoreSheetEntryScoring.push(item);

                if (item.period === 1) {
                  $scope.data.scoreSheetEntryScoring1st.push(item);
                } else if (item.period === 2) {
                  $scope.data.scoreSheetEntryScoring2nd.push(item);
                } else if (item.period === 3) {
                  $scope.data.scoreSheetEntryScoring3rd.push(item);
                } else {
                  $scope.data.scoreSheetEntryScoringOT.push(item);
                }
              });

              $scope.events.scoreSheetEntryScoringLoaded = true;

              alertService.successRetrieval(retrievedType, $scope.data.scoreSheetEntryScoring.length);
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

                if (item.period === 1) {
                  $scope.data.scoreSheetEntryPenalties1st.push(item);
                } else if (item.period === 2) {
                  $scope.data.scoreSheetEntryPenalties2nd.push(item);
                } else if (item.period === 3) {
                  $scope.data.scoreSheetEntryPenalties3rd.push(item);
                } else {
                  $scope.data.scoreSheetEntryPenaltiesOT.push(item);
                }
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

      $scope.getGoalieStatsGame = function (gameId, fullDetail) {
        var retrievedType = "GoalieStatsGame";

        $scope.events.goalieStatsGameLoaded = false;
        $scope.data.goalieStatsGame = [];

        dataServiceGoalieStatsGame.listByGameId(gameId, fullDetail).$promise.then(
          function (result) {
            // service call on success
            if (result) {

              
              angular.forEach(result, function (item, index) {
                $scope.data.goalieStatsGame.push(item);
              });

              var winner = _.find(result, function(item) { return item.wins === 1;});
              var loser = _.find(result, function(item) { return item.wins === 0;});

              if (winner) {
                $scope.data.goalieStatsGameWinner = winner;
                $scope.data.goalieStatsGameLoser = loser;
              } else {
                // then the game was a tie...set the player ids to -1
                $scope.data.goalieStatsGameWinner = { playerId: -1 };
                $scope.data.goalieStatsGameLoser = { playerId: -1 };
              }

              $scope.events.goalieStatsGameLoaded = true;

              alertService.successRetrieval(retrievedType, $scope.data.goalieStatsGame.length);
            } else {
              // results not successful
              alertService.errorRetrieval(retrievedType, result.reason);
            }
          }
        );
      };

      $scope.setWatches = function () {
        //$scope.$watch('gameId', function (newVal, oldVal) {
        //  if (newVal !== oldVal) {
        //    $scope.getScoreSheetEntryScoring($scope.gameId, true);
        //  }
        //}, true);
      };

      $scope.activate = function () {
        $scope.initializeScopeVariables();
        $scope.setWatches();
        $scope.getScoreSheetEntryScoring($scope.gameId, true);
        $scope.getScoreSheetEntryPenalties($scope.gameId, true);
        $scope.getGoalieStatsGame($scope.gameId, true);
      };

      $scope.activate();
    }
  ]
);

