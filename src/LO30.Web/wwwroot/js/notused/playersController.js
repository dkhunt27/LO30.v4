'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('playersController',
    function ($scope, $state, $timeout, apiService, screenSize, externalLibService, criteriaService, broadcastService, returnUrlService) {

      var _ = externalLibService._;

      $scope.initializeScopeVariables = function () {

        $scope.local = {
          selectedPlayerId: 593,
          selectedSeasonId: 56,
          selectedPlayerType: 'skater',
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

          tabActiveIndex: -1,
          tabStates: {
            career: 0,
            season: 1,
            profile: 2
          }
        };
      };


      $scope.sortAscOnly = function (column) {
        $scope.sortOn = column;
        $scope.sortDirection = false;
      };

      $scope.sortDescOnly = function (column) {
        $scope.sortOn = column;
        $scope.sortDirection = true;
      };

      $scope.sortAscFirst = function (column) {
        if ($scope.sortOn === column) {
          $scope.sortDirection = !$scope.sortDirection;
        } else {
          $scope.sortOn = column;
          $scope.sortDirection = false;
        }
      };

      $scope.sortDescFirst = function (column) {
        if ($scope.sortOn === column) {
          $scope.sortDirection = !$scope.sortDirection;
        } else {
          $scope.sortOn = column;
          $scope.sortDirection = true;
        }
      };

      $scope.sortClass = function (column, sortDirection) {

        var ngClass = "";

        if ($scope.sortOn === column) {
          if ($scope.sortDirection === true) {
            ngClass = "fa fa-sort-desc";
          } else {
            ngClass = "fa fa-sort-asc";
          }
        }

        return ngClass;
      }

      $scope.fetchPlayerStatCareer = function (playerId, type) {

        $scope.local.fetchplayerStatCareerCompleted = false;

        $scope.local.playerStatCareer = {};
 
        var apiServiceType = "playerStatCareers";

        if (type === "goalie") {

          apiServiceType = "goalieStatCareers";

        }

        apiService[apiServiceType].getForPlayerId(playerId).then(function (fulfilled) {

          $scope.local.playerStatCareer = fulfilled;

          $scope.buildPlayerStatCareerToDisplay();

        }).finally(function () {

          $scope.local.fetchplayerStatCareerCompleted = true;

        });
      };

      $scope.fetchPlayerStatSeasons = function (playerId, type) {

        $scope.local.fetchPlayerStatSeasonsCompleted = false;

        $scope.local.playerStatSeasons = [];

        var apiServiceType = "playerStatSeasons";

        if (type === "goalie") {

          apiServiceType = "goalieStatSeasons";

        }

        apiService[apiServiceType].listForPlayerId(playerId).then(function (fulfilled) {

          $scope.local.playerStatSeasons = _.sortBy(fulfilled, function (item) { return item.seasonName; });

          $scope.buildPlayerStatSeasonsToDisplay();

        }).finally(function () {

          $scope.local.fetchPlayerStatSeasonsCompleted = true;

        });
      };

      $scope.fetchPlayerStatTeams = function (playerId, seasonId, type) {

        $scope.local.fetchPlayerStatTeamsCompleted = false;

        $scope.local.playerStatTeams = [];

        var apiServiceType = "playerStatTeams";

        if (type === "goalie") {

          apiServiceType = "goalieStatTeams";

        }

        apiService[apiServiceType].listForPlayerIdSeasonId(playerId, seasonId).then(function (fulfilled) {

          $scope.local.playerStatTeams = _.sortBy(fulfilled, function(item) { return item.sub; });

          $scope.buildPlayerStatTeamsToDisplay();

        }).finally(function () {

          $scope.local.fetchPlayerStatTeamsCompleted = true;

        });

      };

      $scope.fetchPlayerStatGames = function (playerId, seasonId, type) {

        $scope.local.fetchPlayerStatGamesCompleted = false;

        $scope.local.playerStatGames = [];

        var apiServiceType = "playerStatGames";

        if (type === "goalie") {

          apiServiceType = "goalieStatGames";

        }

        apiService[apiServiceType].listForPlayerIdSeasonId(playerId, seasonId).then(function (fulfilled) {

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

          item.playerNameToDisplay = item.playerFirstName + '<br/>' + item.playerLastName;

          if (item.playerSuffix) {
            item.playerNameToDisplay = item.playerNameToDisplay + ' ' + item.playerSuffix;
          }

        } else if (screenSize.is('md')) {

          item.playerNameToDisplay = item.playerFirstName + '<br/>' + item.playerLastName;

          if (item.playerSuffix) {
            item.playerNameToDisplay = item.playerNameToDisplay + ' ' + item.playerSuffix;
          }

        } else {

          item.playerNameToDisplay = item.playerFirstName + ' ' + item.playerLastName;

          if (item.playerSuffix) {
            item.playerNameToDisplay = item.playerNameToDisplay + ' ' + item.playerSuffix;
          }


        }
      };

      $scope.buildPlayerStatSeasonsToDisplay = function () {

        $scope.local.playerStatSeasonsToDisplay = $scope.local.playerStatSeasons.map(function (item, index) {

          item.rank = index + 1;

          if (screenSize.is('xs, sm')) {

            item.playerNameToDisplay = item.playerFirstName + '/n' + item.playerLastName;

            if (item.playerSuffix) {
              item.playerNameToDisplay = item.playerNameToDisplay + ' ' + item.playerSuffix;
            }

          } else if (screenSize.is('md')) {

            item.playerNameToDisplay = item.playerFirstName + '/n' + item.playerLastName;

            if (item.playerSuffix) {
              item.playerNameToDisplay = item.playerNameToDisplay + ' ' + item.playerSuffix;
            }

          } else {

            item.playerNameToDisplay = item.playerFirstName + ' ' + item.playerLastName;

            if (item.playerSuffix) {
              item.playerNameToDisplay = item.playerNameToDisplay + ' ' + item.playerSuffix;
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
            item.playerNameToDisplay = item.playerFirstName + '<br/>' + item.playerLastName;

            if (item.playerSuffix) {
              item.playerNameToDisplay = item.playerNameToDisplay + ' ' + item.playerSuffix;
            }

          } else if (screenSize.is('md')) {

            item.teamNameToDisplay = item.teamNameShort;
            item.playerNameToDisplay = item.playerFirstName + '<br/>' + item.playerLastName;

            if (item.playerSuffix) {
              item.playerNameToDisplay = item.playerNameToDisplay + ' ' + item.playerSuffix;
            }

          } else {

            item.teamNameToDisplay = item.teamNameShort;
            item.playerNameToDisplay = item.playerFirstName + ' ' + item.playerLastName;

            if (item.playerSuffix) {
              item.playerNameToDisplay = item.playerNameToDisplay + ' ' + item.playerSuffix;
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

      $scope.fetchData = function () {

        var seasonId = criteriaService.seasonId.get();

        var seasonTypeId = criteriaService.seasonTypeId.get();

        switch ($scope.local.tabActiveIndex) {
          case $scope.local.tabStates.career:

            $scope.fetchPlayerStatCareer($scope.local.selectedPlayerId, $scope.local.selectedPlayerType);

            $scope.fetchPlayerStatSeasons($scope.local.selectedPlayerId, $scope.local.selectedPlayerType);

            $state.params.tab = "career";

            break;
          case $scope.local.tabStates.season:

            $scope.fetchPlayerStatTeams($scope.local.selectedPlayerId, seasonId, $scope.local.selectedPlayerType);

            $scope.fetchPlayerStatGames($scope.local.selectedPlayerId, seasonId, $scope.local.selectedPlayerType);

            $state.params.tab = "season";

            break;
          default:
            $log.debug("tabActiveIndex not mapped for: ", newVal);
        }
      };

      $scope.setWatches = function () {
        $scope.$watch('local.tabActiveIndex', function (newVal, oldVal) {

          if (newVal > -1 && newVal !== oldVal) {

            $scope.fetchData();

          }
        });

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

        // (this covers tab=career since initializes as index=0)
        $scope.local.tabActiveIndex = -1;

        $scope.setWatches();

        $scope.setReturnUrlForCriteriaSelector();

        if ($state.params.playerId) {

          $scope.local.selectedPlayerId = parseInt($state.params.playerId, 10);

        }

        if ($state.params.playerType) {

          $scope.local.selectedPlayerType = $state.params.playerType;
        }

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
            $scope.local.tabActiveIndex = $scope.local.tabStates.season;  // set season as default tab
          }, 100);

        }

      };

      $scope.activate();

    }
);