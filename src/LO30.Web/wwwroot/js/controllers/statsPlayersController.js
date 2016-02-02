'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('statsPlayersController',
    function ($scope, $routeParams, $timeout, apiService, criteriaService, screenSize, broadcastService, externalLibService) {

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
          selectedType: "skater",
          playerStatTeams: [],
          playerStatTeamsToDisplay: [],
          teams: [],
          fetchPlayerStatTeamsCompleted: false,
          fetchTeamsCompleted: false,
          searchText: null,
          selectedTeam: null,
          selectedPosition: null,
          selectedLine: null,
          selectedSub: null
        };
      };

      $scope.filterTable = function(filterBy) {

        $('.filter-api').click(function (e) {
            e.preventDefault();

            //get the footable filter object
            var footableFilter = $('table').data('footable-filter');

            alert('about to filter table by "tech"');
            //filter by 'tech'
            footableFilter.filter('tech');

            //clear the filter
            if (confirm('clear filter now?')) {
                footableFilter.clearFilter();
            }
        }); 
      };

      $scope.filterByTeam = function (team) {

        var teamToSearchOn;
        if (screenSize.is('xs, sm')) {

          teamToSearchOn = item.teamCode;

        } else if (screenSize.is('md')) {

          teamToSearchOn = item.teamNameShort;

        } else {

          teamToSearchOn = item.teamNameShort;

        }


        var existingSearch = "team:" + $scope.filterByTeamMapper($scope.local.selectedTeam);

        var newSearch = "team:" + $scope.filterByTeamMapper(teamToSearchOn);

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

      $scope.filterByTeamMapper = function (team) {
        var teamMapped;
        // map filter keys from columns to object
        switch (team) {
          case "Bill Brown":
            teamMapped = "Bill Brown Auto Clinic";
            break;
          case "Hunt's Ace":
            teamMapped = "Hunt's Ace Hardware";
            break;
          case "LAB/PSI":
            teamMapped = "Liv. Auto Body/Phillips Service Ind";
            break;
          case "Zas Ent":
            teamMapped = "Zaschak Enterprises";
            break;
          case "DPKZ":
            teamMapped = "DeBrincat Padgett Kobliska Zick";
            break;
          case "Villanova":
            teamMapped = "Villanova Construction";
            break;
          case "Glover":
            teamMapped = "Jeff Glover Realtors";
            break;
          case "D&G":
            teamMapped = "D&G Heating & Cooling";
            break;
          default:
            teamMapped = team;
        }

        return teamMapped;
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
        var existingSearch = "position:" + $scope.local.selectedPosition;
        var newSearch = "position:" + position;

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

      $scope.sortAscOnly = function (column) {
        $scope.sortOn = column;
        $scope.sortDirection = false;
      };

      $scope.sortDescOnly = function (column) {
        $scope.sortOn = column;
        $scope.sortDirection = true;
      };

      $scope.removeSearch = function () {
        $scope.local.searchText = null;
        $scope.local.selectedTeam = null;
        $scope.local.selectedPosition = null;
        $scope.local.selectedLine = null;
        $scope.local.selectedSub = null;
      };

      $scope.fetchPlayerStatTeams = function (seasonId, playoffs) {

        $scope.local.fetchPlayerStatTeamsCompleted = false;

        $scope.local.playerStatTeams = [];

        var apiServiceType = "playerStatTeams";

        if ($scope.local.selectedType === "goalie") {

          apiServiceType = "goalieStatTeams";

        }

        apiService[apiServiceType].listForSeasonIdPlayoffs(seasonId, playoffs).then(function (fulfilled) {

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

          if (screenSize.is('xs, sm')) {

            item.teamNameToDisplay = item.teamCode;
            item.playerNameToDisplay = item.playerFirstName + ' ' + item.playerLastName;

            if (item.playerSuffix) {
              item.playerNameToDisplay = item.playerNameToDisplay + ' ' + item.playerSuffix;
            }

          } else if (screenSize.is('md')) {

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

          if (screenSize.is('xs, sm')) {

            item.teamNameToDisplay = item.teamCode;

          } else if (screenSize.is('md')) {

            item.teamNameToDisplay = item.teamNameShort;

          } else {

            item.teamNameToDisplay = item.teamNameShort;

          }

          return item;
        });
      };

      $scope.fetchData = function () {
        var criteriaSeason = criteriaService.season.get();

        var criteriaSeasonType = criteriaService.seasonType.get();

        var criteriaSeasonTypeBool;

        if (criteriaSeasonType === "Playoffs") {

          criteriaSeasonTypeBool = true;

        } else {

          criteriaSeasonTypeBool = false;

        }

        $scope.fetchTeams(criteriaSeason.seasonId);
        $scope.fetchPlayerStatTeams(criteriaSeason.seasonId, criteriaSeasonTypeBool);
      };

      $scope.setWatches = function () {

        $scope.$on(broadcastService.events().seasonSet, function () {

          $scope.fetchData();

        });

        $scope.$on(broadcastService.events().seasonTypeSet, function () {

          $scope.fetchData();

        });
      };

      $scope.activate = function () {

        $scope.initializeScopeVariables();

        $scope.setWatches();

        if ($routeParams.type) {

          $scope.local.selectedType = $routeParams.type;
        }

        $scope.fetchData();

        $timeout(function () {
          $scope.sortDescOnly('p');
          $scope.filterBySub("Without");
        }, 0);  // using timeout so it fires when done rendering
      };

      $scope.activate();
    }
);