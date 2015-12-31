'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('playersController',
    function ($scope, $routeParams, $timeout, apiService, criteriaServiceResolved, screenSize, broadcastService, externalLibService) {

      var _ = externalLibService._;

      $scope.initializeScopeVariables = function () {

        $scope.local = {
          selectedPlayerId: 593,
          selectedSeasonId: 56,
          playerStatGames: [],
          playerStatTeams: [],
          playerStatSeasons: [],
          playerStatCareer: {},
          playerStatGamesToDisplay: [],
          playerStatTeamsToDisplay: [],
          playerStatSeasonsToDisplay: [],
          playerStatCareerToDisplay: [],
          fetchplayerStatGamesCompleted: false,
          fetchPlayerStatTeamsCompleted: false,
          fetchplayerStatSeasonsCompleted: false,
          fetchplayerStatCareerCompleted: false,

          tabStates: {
            season: false,
            career: false,
            profile: false
          }
        };
      };

      $scope.fetchPlayerStatCareer = function (playerId) {

        $scope.local.fetchplayerStatCareerCompleted = false;

        $scope.local.playerStatCareer = {};

        apiService.playerStatCareers.getForPlayerId(playerId).then(function (fulfilled) {

          $scope.local.playerStatCareer = fulfilled;

          $scope.buildPlayerStatCareerToDisplay();

        }).finally(function () {

          $scope.local.fetchplayerStatCareerCompleted = true;

        });
      };

      $scope.fetchPlayerStatSeasons = function (playerId) {

        $scope.local.fetchPlayerStatSeasonsCompleted = false;

        $scope.local.playerStatSeasons = [];

        apiService.playerStatSeasons.listForPlayerId(playerId).then(function (fulfilled) {

          $scope.local.playerStatSeasons = _.sortBy(fulfilled, function (item) { return item.seasonName; });

          $scope.buildPlayerStatSeasonsToDisplay();

        }).finally(function () {

          $scope.local.fetchPlayerStatSeasonsCompleted = true;

        });
      };

      $scope.fetchPlayerStatTeams = function (playerId, seasonId) {

        $scope.local.fetchPlayerStatTeamsCompleted = false;

        $scope.local.playerStatTeams = [];

        apiService.playerStatTeams.listForPlayerIdSeasonId(playerId, seasonId).then(function (fulfilled) {

          $scope.local.playerStatTeams = _.sortBy(fulfilled, function(item) { return item.sub; });

          $scope.buildPlayerStatTeamsToDisplay();

        }).finally(function () {

          $scope.local.fetchPlayerStatTeamsCompleted = true;

        });
      };

      $scope.fetchPlayerStatGames = function (playerId, seasonId) {

        $scope.local.fetchPlayerStatGamesCompleted = false;

        $scope.local.playerStatGames = [];

        apiService.playerStatGames.listForPlayerIdSeasonId(playerId, seasonId).then(function (fulfilled) {

          $scope.local.playerStatGames = _.sortBy(fulfilled, function (item) { return item.gameId * -1; });

          $scope.buildPlayerStatGamesToDisplay();

        }).finally(function () {

          $scope.local.fetchPlayerStatGamesCompleted = true;

        });
      };

      $scope.buildPlayerStatCareerToDisplay = function () {

        $scope.local.playerStatCareerToDisplay = $scope.local.playerStatCareer;

        var item = $scope.local.playerStatCareerToDisplay;

        if (screenSize.is('xs, sm')) {

          item.playerNameToDisplay = item.firstName + '<br/>' + item.lastName;

          if (item.suffix) {
            item.playerNameToDisplay = item.playerNameToDisplay + ' ' + item.suffix;
          }

        } else if (screenSize.is('md')) {

          item.playerNameToDisplay = item.firstName + '<br/>' + item.lastName;

          if (item.suffix) {
            item.playerNameToDisplay = item.playerNameToDisplay + ' ' + item.suffix;
          }

        } else {

          item.playerNameToDisplay = item.firstName + ' ' + item.lastName;

          if (item.suffix) {
            item.playerNameToDisplay = item.playerNameToDisplay + ' ' + item.suffix;
          }


        }
      };

      $scope.buildPlayerStatSeasonsToDisplay = function () {

        $scope.local.playerStatSeasonsToDisplay = $scope.local.playerStatSeasons.map(function (item, index) {

          item.rank = index + 1;

          if (screenSize.is('xs, sm')) {

            item.playerNameToDisplay = item.firstName + '/n' + item.lastName;

            if (item.suffix) {
              item.playerNameToDisplay = item.playerNameToDisplay + ' ' + item.suffix;
            }

          } else if (screenSize.is('md')) {

            item.playerNameToDisplay = item.firstName + '/n' + item.lastName;

            if (item.suffix) {
              item.playerNameToDisplay = item.playerNameToDisplay + ' ' + item.suffix;
            }

          } else {

            item.playerNameToDisplay = item.firstName + ' ' + item.lastName;

            if (item.suffix) {
              item.playerNameToDisplay = item.playerNameToDisplay + ' ' + item.suffix;
            }

          }

          return item;
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

      $scope.buildPlayerStatGamesToDisplay = function () {

        $scope.local.playerStatGamesToDisplay = $scope.local.playerStatGames.map(function (item, index) {

          item.rank = index + 1;

          if (screenSize.is('xs, sm')) {

            item.teamNameToDisplay = item.teamNameCode;

          } else if (screenSize.is('md')) {

            item.teamNameToDisplay = item.teamNameShort;

          } else {

            item.teamNameToDisplay = item.teamNameShort;

          }

          return item;
        });
      };

      $scope.setWatches = function () {

        $scope.$watch('local.tabStates.season', function (newVal, oldVal) {

          if (newVal !== oldVal && newVal) {

            // default is season
            $scope.fetchPlayerStatTeams($scope.local.selectedPlayerId, $scope.local.selectedSeasonId);

            $scope.fetchPlayerStatGames($scope.local.selectedPlayerId, $scope.local.selectedSeasonId);

          }

        });

        $scope.$watch('local.tabStates.career', function (newVal, oldVal) {

          if (newVal !== oldVal && newVal) {

            $scope.fetchPlayerStatCareer($scope.local.selectedPlayerId);

            $scope.fetchPlayerStatSeasons($scope.local.selectedPlayerId);
          }
        });
      };

      $scope.activate = function () {

        $scope.initializeScopeVariables();

        $scope.setWatches();

        if ($routeParams.playerId) {

          $scope.local.selectedPlayerId = parseInt($routeParams.playerId, 10);

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
            $scope.local.tabStates.season = true;
          }, 100);

        }

      };

      $scope.activate();
    }
);