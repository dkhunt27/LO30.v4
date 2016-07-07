'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('statsPlayersController',
    function ($scope, $state, $stateParams, $timeout, apiService, screenSize, externalLibService, criteriaService, broadcastService, returnUrlService) {

      var _ = externalLibService._;

      $scope.initializeScopeVariables = function () {

        $scope.positions = [
          "F",
          "D",
          "G"
        ];

        $scope.subs = [
          "With",
          "Without",
        ];

        $scope.lines = [
          "1",
          "2",
          "3",
        ];

        $scope.local = {
          screenSizeIsDesktop: false,
          screenSizeIsTablet: false,
          screenSizeIsMobile: false,
          selectedPlayerType: "skater",
          playerStatTeams: [],
          playerStatTeamsToDisplay: [],
          teams: [],
          fetchPlayerStatTeamsCompleted: false,
          fetchTeamsCompleted: false,
          searchText: null,
          selectedTeam: null,
          selectedPosition: null,
          selectedLine: null,
          selectedSub: null,

          criteriaSeasonId: -1,
          criteriaSeasonTypeId: -1
        };
      };

      $scope.filterByTeam = function (team) {

        var teamToSearchOn;
        if ($scope.local.screenSizeIsMobile) {

          teamToSearchOn = team.teamCode;

        } else if ($scope.local.screenSizeIsTablet) {

          teamToSearchOn = team.teamNameShort;

        } else {

          teamToSearchOn = team.teamNameShort;

        }


        var existingSearch = "team:" + $scope.local.selectedTeam;

        var newSearch = "team:" + teamToSearchOn;

        if ($scope.local.selectedTeam) {
          // if selected populated, that means there was a search before...remove that first 
          $scope.removeExistingSearchFromSearch(existingSearch);
        }

        if ($scope.local.selectedTeam === teamToSearchOn) {
          // if same thing was clicked again...already been remove from search...just reset vars
          $scope.local.selectedTeam = null;
        } else {
          // this is a new search, add to search
          $scope.prepSearchForNewSearch();
          $scope.addNewSearchToSearch(newSearch);
          $scope.local.selectedTeam = teamToSearchOn;
        }

      };

      $scope.filterBySub = function (sub) {
        var existingSearch = "sub:" + $scope.filterBySubMapper($scope.local.selectedSub);
        var newSearch = "sub:" + $scope.filterBySubMapper(sub);

        if ($scope.local.selectedSub) {
          // if selected populated, that means there was a search before...remove that first 
          $scope.removeExistingSearchFromSearch(existingSearch);
        }

        if ($scope.local.selectedSub === sub) {
          // if same thing was clicked again...already been remove from search...just reset vars
          $scope.local.selectedSub = null;
        } else {
          // this is a new search, add to search
          $scope.prepSearchForNewSearch();
          $scope.addNewSearchToSearch(newSearch);
          $scope.local.selectedSub = sub;
        }

        $scope.resetSort();
      };

      $scope.filterBySubMapper = function (sub) {
        var subMapped;
        // map filter keys from columns to object
        switch (sub) {
          case "With":
            subMapped = "Y";
            break;
          case "Without":
            subMapped = "N";
            break;
          default:
            subMapped = sub;
        }

        return subMapped;
      };

      $scope.filterByLine = function (line) {
        var existingSearch = "line:" + $scope.local.selectedLine;
        var newSearch = "line:" + line;

        if ($scope.local.selectedLine) {
          // if selected populated, that means there was a search before...remove that first 
          $scope.removeExistingSearchFromSearch(existingSearch);
        }

        if ($scope.local.selectedLine === line) {
          // if same thing was clicked again...already been remove from search...just reset vars
          $scope.local.selectedLine = null;
        } else {
          // this is a new search, add to search
          $scope.prepSearchForNewSearch();
          $scope.addNewSearchToSearch(newSearch);
          $scope.local.selectedLine = line;
        }

        $scope.resetSort();
      };

      $scope.filterByPosition = function (position) {
        var existingSearch = "pos:" + $scope.local.selectedPosition;
        var newSearch = "pos:" + position;

        if ($scope.local.selectedPosition) {
          // if selected populated, that means there was a search before...remove that first 
          $scope.removeExistingSearchFromSearch(existingSearch);
        }

        if ($scope.local.selectedPosition === position) {
          // if same thing was clicked again...already been remove from search...just reset vars
          $scope.local.selectedPosition = null;
        } else {
          // this is a new search, add to search
          $scope.prepSearchForNewSearch();
          $scope.addNewSearchToSearch(newSearch);
          $scope.local.selectedPosition = position;
        }

        $scope.resetSort();
      };

      $scope.resetSort = function (newSearch) {
        //$scope.sortDescFirst('p');
      };

      $scope.addNewSearchToSearch = function (newSearch) {
        $scope.local.searchText = $scope.local.searchText + newSearch;
      };

      $scope.removeExistingSearchFromSearch = function (existingSearch) {
        $scope.local.searchText = $scope.local.searchText.replace(", " + existingSearch, "");
        $scope.local.searchText = $scope.local.searchText.replace(existingSearch + ", ", "");
        $scope.local.searchText = $scope.local.searchText.replace(existingSearch, "");
      };

      $scope.prepSearchForNewSearch = function () {
        if ($scope.local.searchText) {
          $scope.local.searchText = $scope.local.searchText + ", ";
        } else {
          $scope.local.searchText = "";
        }
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

      $scope.removeSearch = function () {
        $scope.local.searchText = null;
        $scope.local.selectedTeam = null;
        $scope.local.selectedPosition = null;
        $scope.local.selectedLine = null;
        $scope.local.selectedSub = null;
      };

      $scope.fetchPlayerStatTeams = function (seasonId, seasonTypeId) {

        $scope.local.fetchPlayerStatTeamsCompleted = false;

        $scope.local.playerStatTeams = [];

        var apiServiceType = "playerStatTeams";

        if ($scope.local.selectedPlayerType === "goalie") {

          apiServiceType = "goalieStatTeams";

        }

        apiService[apiServiceType].listForSeasonIdSeasonTypeId(seasonId, seasonTypeId).then(function (fulfilled) {

          $scope.local.playerStatTeams = _.sortBy(fulfilled, function(item) { return item.points * -1; });

          $scope.buildPlayerStatTeamsToDisplay();

        }).finally(function () {

          $scope.local.fetchPlayerStatTeamsCompleted = true;

        });
      };

      $scope.buildPlayerStatTeamsToDisplay = function () {

        $scope.local.playerStatTeamsToDisplay = $scope.local.playerStatTeams.map(function (item, index) {

          item.sub = item.sub ? "Y" : "N";

          item.rank = index + 1;

          if ($scope.local.screenSizeIsMobile) {

            item.teamNameToDisplay = item.teamCode;
            item.playerNameToDisplay = item.playerFirstName + ' ' + item.playerLastName;

            if (item.playerSuffix) {
              item.playerNameToDisplay = item.playerNameToDisplay + ' ' + item.playerSuffix;
            }

          } else if ($scope.local.screenSizeIsTablet) {

            item.teamNameToDisplay = item.teamNameShort;
            item.playerNameToDisplay = item.playerFirstName + ' ' + item.playerLastName;

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

      $scope.fetchTeams = function (seasonId) {

        $scope.local.fetchTeamsCompleted = false;

        $scope.local.teams = [];

        apiService.teams.listForSeasonId(seasonId).then(function (fulfilled) {

          $scope.local.teams = fulfilled;

          angular.forEach(fulfilled, function (item, index) {

            $scope.buildTeamsToDisplay();

          });

        }).finally(function () {

          $scope.local.fetchScoreSheetEntryGoalsCompleted = true;

        });
      };

      $scope.buildTeamsToDisplay = function () {

        $scope.local.teamsToDisplay = $scope.local.teams.map(function (item, index) {

          item.rank = index + 1;

          if ($scope.local.screenSizeIsMobile) {

            item.teamNameToDisplay = item.teamCode;

          } else if ($scope.local.screenSizeIsTablet) {

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

        $scope.fetchTeams(seasonId);

        $scope.fetchPlayerStatTeams(seasonId, seasonTypeId);
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

        $scope.setWatches();

        $scope.setReturnUrlForCriteriaSelector();

        $scope.local.screenSizeIsDesktop = screenSize.is('lg');
        $scope.local.screenSizeIsTablet = screenSize.is('md');
        $scope.local.screenSizeIsMobile = screenSize.is('xs, sm');

        if ($stateParams.playerType) {

          $scope.local.selectedPlayerType = $stateParams.playerType;
        }

        $scope.fetchData();

        $timeout(function () {
          if ($scope.local.selectedPlayerType === 'skater') {
            $scope.sortDescFirst('points');
          } else {
            $scope.sortAscFirst('goalsAgainstAverage');
          }
          $scope.filterBySub("Without");
        }, 0);  
      };

      $scope.activate();
    }
);