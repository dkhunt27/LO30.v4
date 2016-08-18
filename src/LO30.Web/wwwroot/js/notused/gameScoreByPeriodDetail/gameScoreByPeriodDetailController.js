'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('lo30GameScoreByPeriodDetailController',
  [
    '$log',
    '$scope',
    'externalLibService',
    'apiService',
    'screenSize',
    function ($log, $scope, externalLibService, apiService, screenSize) {

      var _ = externalLibService._;

      $scope.initializeScopeVariables = function () {

        $scope.local = {
          scoreSheetEntryGoals: [],
          scoreSheetEntryScoring1st: [],
          scoreSheetEntryScoring2nd: [],
          scoreSheetEntryScoring3rd: [],
          scoreSheetEntryScoringOT: [],

          scoreSheetEntryPenalties: [],
          scoreSheetEntryPenalties1st: [],
          scoreSheetEntryPenalties2nd: [],
          scoreSheetEntryPenalties3rd: [],
          scoreSheetEntryPenaltiesOT: [],

          goalieStatGames: [],
          goalieStatGameWinner: {},
          goalieStatGameLoser: {},

          fetchScoreSheetEntryPenaltiesCompleted: false,
          fetchScoreSheetEntryGoalsCompleted: false,
          fetchGoalieStatGamesCompleted: false
        };
      };


      $scope.fetchScoreSheetEntryGoals = function (gameId) {

        $scope.local.fetchScoreSheetEntryGoalsCompleted = false;

        $scope.local.scoreSheetEntriesGoals = [];

        apiService.scoreSheetEntryProcessedGoals.listForGameId(gameId).then(function (fulfilled) {

          $scope.local.scoreSheetEntriesGoals = fulfilled;

          angular.forEach(fulfilled, function (item, index) {

            item.goalPlayerNameToDisplay = item.goalPlayerFirstName + ' ' + item.goalPlayerLastName;

            if (item.goalPlayerLastNameSuffix) {
              item.goalPlayerNameToDisplay = item.goalPlayerNameToDisplay + ' ' + item.goalPlayerLastNameSuffix;
            }

            if (item.assist1PlayerLastName) {

              item.assist1PlayerNameToDisplay = item.assist1PlayerFirstName + ' ' + item.assist1PlayerLastName;

              if (item.assist1PlayerLastNameSuffix) {
                item.assist1PlayerNameToDisplay = item.assist1PlayerNameToDisplay + ' ' + item.assist1PlayerLastNameSuffix;
              }
            }

            if (item.assist2PlayerLastName) {

              item.assist2PlayerNameToDisplay = item.assist2PlayerFirstName + ' ' + item.assist2PlayerLastName;

              if (item.assist2PlayerLastNameSuffix) {
                item.assist2PlayerNameToDisplay = item.assist2PlayerNameToDisplay + ' ' + item.assist2PlayerLastNameSuffix;
              }
            }
            
            if (item.assist3PlayerLastName) {

              item.assist3PlayerNameToDisplay = item.assist3PlayerFirstName + ' ' + item.assist3PlayerLastName;

              if (item.assist3PlayerLastNameSuffix) {
                item.assist3PlayerLastNameSuffix = item.assist3PlayerLastNameSuffix + ' ' + item.assist3PlayerLastNameSuffix;
              }
            }

            if (screenSize.is('xs, sm')) {

              item.teamNameToDisplay = item.teamCode;

            } else if (screenSize.is('md')) {

              item.teamNameToDisplay = item.teamNameShort;

            } else {

              item.teamNameToDisplay = item.teamNameShort;

            }

            if (item.period === 1) {

              $scope.local.scoreSheetEntryScoring1st.push(item);

            } else if (item.period === 2) {

              $scope.local.scoreSheetEntryScoring2nd.push(item);

            } else if (item.period === 3) {

              $scope.local.scoreSheetEntryScoring3rd.push(item);

            } else {

              $scope.local.scoreSheetEntryScoringOT.push(item);

            }

          });

        }).finally(function () {

          $scope.local.fetchScoreSheetEntryGoalsCompleted = true;

        });
      };

      $scope.fetchScoreSheetEntryPenalties = function (gameId) {

        $scope.local.fetchScoreSheetEntryPenaltiesCompleted = false;

        $scope.local.scoreSheetEntryPenalties = [];

        apiService.scoreSheetEntryProcessedPenalties.listForGameId(gameId).then(function (fulfilled) {

          $scope.local.scoreSheetEntryPenalties = fulfilled;

          angular.forEach(fulfilled, function (item, index) {

            item.playerNameToDisplay = item.playerFirstName + ' ' + item.playerLastName;

            if (item.playerLastNameSuffix) {
              item.playerNameToDisplay = item.playerNameToDisplay + ' ' + item.playerLastNameSuffix;
            }
            
            if (screenSize.is('xs, sm')) {

              item.teamNameToDisplay = item.teamCode;

            } else if (screenSize.is('md')) {

              item.teamNameToDisplay = item.teamNameShort;

            } else {

              item.teamNameToDisplay = item.teamNameShort;

            }

            if (item.period === 1) {

              $scope.local.scoreSheetEntryPenalties1st.push(item);

            } else if (item.period === 2) {

              $scope.local.scoreSheetEntryPenalties2nd.push(item);

            } else if (item.period === 3) {

              $scope.local.scoreSheetEntryPenalties3rd.push(item);

            } else {

              $scope.local.scoreSheetEntryPenaltiesOT.push(item);

            }

          });

        }).finally(function () {

          $scope.local.fetchScoreSheetEntryPenaltiesCompleted = true;

        });
      };

      $scope.fetchGoalieStatGames = function (gameId) {

        $scope.local.fetchGoalieStatGamesCompleted = false;

        $scope.local.goalieStatGames = [];

        apiService.goalieStatGames.listForGameId(gameId).then(function (fulfilled) {

          $scope.local.goalieStatGames = fulfilled;

          angular.forEach(fulfilled, function (item, index) {

            item.playerNameToDisplay = item.playerFirstName + ' ' + item.playerLastName;

            if (item.playerLastNameSuffix) {
              item.playerNameToDisplay = item.playerNameToDisplay + ' ' + item.playerLastNameSuffix;
            }

            if (screenSize.is('xs, sm')) {

              item.teamNameToDisplay = item.teamCode;

            } else if (screenSize.is('md')) {

              item.teamNameToDisplay = item.teamNameShort;

            } else {

              item.teamNameToDisplay = item.teamNameShort;

            }

            if (item.wins === 1) {

              $scope.local.goalieStatGameWinner = item;

            } else {

              $scope.local.goalieStatGameLoser = item;

            }

          });

        }).finally(function () {

          $scope.local.fetchGoalieStatGamesCompleted = true;

        });
      };

      $scope.activate = function () {

        $scope.initializeScopeVariables();

        $scope.fetchScoreSheetEntryGoals($scope.gameId);

        $scope.fetchScoreSheetEntryPenalties($scope.gameId);

        $scope.fetchGoalieStatGames($scope.gameId);

      };

      $scope.activate();
    }
  ]
);

