'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('teamsController',
    function ($log, $scope, $state, $timeout, apiService, screenSize, externalLibService, constScheduleTeamFeedBaseUrl, criteriaService, broadcastService, returnUrlService) {

      var _ = externalLibService._;

      $scope.initializeScopeVariables = function () {

        $scope.local = {
          selectedTeamId: 318,
          selectedTeam: "not set",
          teamStandings: [],
          teamStandingsToDisplay: [],
          games: [],
          gamesToDisplay: [],
          gamesToDisplayCompleted: [],
          gamesToDisplayUpcoming: [],
          teamFeed: {},
          fetchTeamStandingsCompleted: false,
          fetchGamesCompleted: false,

          tabActiveIndex: -1,
          tabStates: {
            completed: 0,
            upcoming: 1,
            schedule: 2
          }
        };
      };

      $scope.fetchTeamStandings = function (seasonId, teamId) {

        $scope.local.fetchTeamStandingsCompleted = false;

        $scope.local.teamStandings = [];

        apiService.teamStandings.listForSeasonIdTeamId(seasonId, teamId).then(function (fulfilled) {

          $scope.local.teamStandings = fulfilled;

          $scope.buildTeamStandingsToDisplay();

          $scope.buildTeamFeed();

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

      $scope.buildTeamFeed = function () {

        var team = $scope.local.teamStandings[0]; // all the team info should be the same, so just take the first one

        var seasonId = team.seasonId;
        var teamId = team.teamId;
        var scheduleTeamName = team.teamNameLong.replace(/ /g, "").replace(/\//g, "").replace(/-/g, "").replace(/\./g, "");
        var scheduleSeasonName = team.seasonName.replace(/ /g, "");

        $scope.local.teamFeed = {
          teamCode: team.teamCode,
          teamNameLong: team.teamNameLong,
          teamNameShort: team.teamNameShort,
          teamFeedUrl: constScheduleTeamFeedBaseUrl + "/Schedule/TeamFeed/Seasons/" + seasonId + "/Teams/" + teamId + "/LO30Schedule-" + scheduleTeamName + "-" + scheduleSeasonName
        };

        $log.debug("teamFeed", $scope.local.teamFeed)
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

      $scope.fetchData = function () {

        var seasonId = criteriaService.seasonId.get();

        var seasonTypeId = criteriaService.seasonTypeId.get();

        if ($state.params.teamId) {

          $scope.local.selectedTeamId = parseInt($state.params.teamId, 10);
        }

        $scope.fetchTeamStandings(seasonId, $scope.local.selectedTeamId);

        $scope.fetchGames(seasonId, $scope.local.selectedTeamId);
      };

      $scope.setWatches = function () {
        $scope.$on(broadcastService.events().seasonSet, function () {

          $scope.fetchData();

        });

        $scope.$on(broadcastService.events().seasonTypeSet, function () {

          $scope.fetchData();

        });
      };

      $scope.setReturnUrlForCriteriaSelector = function () {

        var currentUrl = $state.href($state.current.name, $state.params, { absolute: false });

        returnUrlService.set(currentUrl);

      };

      $scope.activate = function () {

        $scope.initializeScopeVariables();

        $scope.setReturnUrlForCriteriaSelector();

        if ($state.params.tab) {

          // use timeout to let the uib-tab initial the active states
          $timeout(function () {
            // map to active tab index
            $scope.local.tabActiveIndex = $scope.local.tabStates[$state.params.tab];
          }, 100);

        } else {

          // set default tab, after watches so correct data events fire
          // use timeout to let the uib-tab initial the active states
          $timeout(function () {
            $scope.local.tabActiveIndex = $scope.local.tabStates.completed;  // set completed as default tab
          }, 100);
        }
        $scope.fetchData();

      };

      $scope.activate();
    }
);