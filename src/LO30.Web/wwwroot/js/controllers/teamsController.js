'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('teamsController',
    function ($log, $scope, $routeParams, $timeout, apiService, criteriaServiceResolved, screenSize, broadcastService, externalLibService, DTOptionsBuilder, DTColumnBuilder) {

      var _ = externalLibService._;

      $scope.initializeScopeVariables = function () {

        $scope.local = {
          selectedTeamId: 318,
          selectedSeasonId: 56,
          selectedTeam: "not set",
          teamStandings: [],
          teamStandingsToDisplay: [],
          games: [],
          gamesToDisplay: [],
          gamesToDisplayCompleted: [],
          gamesToDisplayUpcoming: [],
          fetchTeamStandingsCompleted: false,
          fetchGamesCompleted: false,

          tabStates: {
            completed: false,
            upcoming: false
          },

          dtStandings: {
            options: DTOptionsBuilder.newOptions()
                          .withOption('paging', false)
                          .withOption('searching', false)
                          .withOption('order', [5, 'desc'])
                        .withOption('fnRowCallback', function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                          var index = iDisplayIndex + 1;
                          $('td:eq(0)', nRow).html(index);
                          return nRow;
                        })
                          .withBootstrap()
          },

          dtGamesCompleted: {
            options: DTOptionsBuilder.newOptions()
                          .withOption('paging', false)
                          .withOption('searching', false)
                          .withOption('order', [5, 'desc'])
                          .withOption('fnRowCallback', function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                            var index = iDisplayIndex + 1;
                            $('td:eq(0)', nRow).html(index);
                            return nRow;
                          })
                          .withBootstrap()
          },
          dtGamesUpcoming: {
            options: DTOptionsBuilder.newOptions()
                          .withOption('paging', false)
                          .withOption('searching', false)
                          .withOption('order', [5, 'desc'])
                          .withOption('fnRowCallback', function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                            var index = iDisplayIndex + 1;
                            $('td:eq(0)', nRow).html(index);
                            return nRow;
                          })
                          .withBootstrap()
          }
        };
      };

      $scope.fetchTeamStandings = function (seasonId, teamId) {

        $scope.local.fetchTeamStandingsCompleted = false;

        $scope.local.teamStandings = [];

        apiService.teamStandings.listForSeasonIdTeamId(seasonId, teamId).then(function (fulfilled) {

          $scope.local.teamStandings = fulfilled;

          $scope.buildTeamStandingsToDisplay();

        }).finally(function () {

          $scope.local.fetchTeamStandingsCompleted = true;

        });
      };

      $scope.buildTeamStandingsToDisplay = function () {

        $scope.local.teamStandingsToDisplay = $scope.local.teamStandings.map(function (item) {

          $scope.selectedTeamName = item.teamNameLong;

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

      $scope.fetchGames = function (seasonId, teamId) {

        $scope.local.fetchGamesCompleted = false;

        $scope.local.games = [];

        apiService.games.listForSeasonIdTeamId(seasonId, teamId).then(function (fulfilled) {

          $scope.local.games = fulfilled;

          $scope.buildGamesToDisplay();

        }).finally(function () {

          $scope.local.fetchGamesCompleted = true;

        });
      };

      $scope.buildGamesToDisplay = function () {

        $scope.local.gamesToDisplay = $scope.local.games.map(function (item, index) {

          item.outcomeToDisplay = item.outcomeAway;

          if (item.teamIdHome === $scope.local.selectedTeamId) {
            item.outcomeToDisplay = item.outcomeHome;
          }

          if (item.overridenAway) {
            item.outcomeToDisplay = item.outcomeToDisplay + "*";
          }

          if (screenSize.is('xs, sm')) {

            item.awayTeamToDisplay = item.teamCodeAway;

            item.homeTeamToDisplay = item.teamCodeHome;

          } else if (screenSize.is('md')) {

            item.awayTeamToDisplay = item.teamNameShortAway;

            item.homeTeamToDisplay = item.teamNameShortHome;

          } else {

            item.awayTeamToDisplay = item.teamNameLongAway;

            item.homeTeamToDisplay = item.teamNameLongHome;

          }

          return item;
        });

        $scope.local.gamesToDisplayCompleted = _.filter($scope.local.gamesToDisplay, function (item) { return item.outcomeHome !== null; });

        $scope.local.gamesToDisplayCompleted = _.sortBy($scope.local.gamesToDisplayCompleted, function (item) { return item.gameId * -1; });

        $scope.local.gamesToDisplayUpcoming = _.filter($scope.local.gamesToDisplay, function (item) { return item.outcomeHome === null; });

        $scope.local.gamesToDisplayUpcoming = _.sortBy($scope.local.gamesToDisplayUpcoming, function (item) { return item.gameId; });

      };

      $scope.activate = function () {

        $scope.initializeScopeVariables();

        if ($routeParams.teamId) {

          $scope.local.selectedTeamId = parseInt($routeParams.teamId, 10);

        }

        if ($routeParams.seasonId) {

          $scope.local.selectedSeasonId = parseInt($routeParams.seasonId, 10);

          criteriaServiceResolved.season.setById($scope.local.selectedSeasonId);
        }

        if ($routeParams.tab) {

          // use timeout to let the uib-tab initial the active states
          $timeout(function () {
            $scope.local.tabStates[$routeParams.tab] = true;
          }, 100);

        } else {

          // set default tab, after watches so correct data events fire
          // use timeout to let the uib-tab initial the active states
          $timeout(function () {
            $scope.local.tabStates.completed = true;
          }, 100);

        }

        $scope.fetchTeamStandings($scope.local.selectedSeasonId, $scope.local.selectedTeamId);

        $scope.fetchGames($scope.local.selectedSeasonId, $scope.local.selectedTeamId);

      };

      $scope.activate();
    }
);