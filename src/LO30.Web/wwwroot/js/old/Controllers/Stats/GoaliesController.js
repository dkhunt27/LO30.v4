'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('statsGoaliesController',
  [
    '$scope',
    '$timeout',
    '$routeParams',
    'alertService',
    'dataServiceForWebGoalieStats',
    'dataServiceSettings',
    'constCurrentSeasonId',
    function ($scope, $timeout, $routeParams, alertService, dataServiceForWebGoalieStats, dataServiceSettings, constCurrentSeasonId) {

      var alertTitleDataRetrievalSuccessful = "Data Retrieval Successful";
      var alertTitleDataRetrievalUnsuccessful = "Data Retrieval Unsuccessful";
      var alertMessageTemplateRetrievalSuccessful = "Retrieved <%=retrievedType%>, Length: <%=retrievedLength%>";
      var alertMessageTemplateRetrievalUnsuccessful = "Received following error trying to retrieve <%=retrievedType%>. Error:<%=retrievedError%>";
      var alertMessage;

      $scope.filterByTeam = function (team) {
        var existingSearch = "team:" + $scope.filterByTeamMapper($scope.user.selectedTeam);
        var newSearch = "team:" + $scope.filterByTeamMapper(team);

        if ($scope.user.selectedTeam) {
          // if selected populated, that means there was a search before...remove that first 
          $scope.removeExistingSearchFromSearch(existingSearch);
        }

        if ($scope.user.selectedTeam === team) {
          // if same thing was clicked again...already been remove from search...just reset vars
          $scope.user.selectedTeam = null;
        } else {
          // this is a new search, add to search
          $scope.prepSearchForNewSearch();
          $scope.addNewSearchToSearch(newSearch);
          $scope.user.selectedTeam = team;
        }

        $scope.resetSort();
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
        var existingSearch = "sub:" + $scope.filterBySubMapper($scope.user.selectedSub);
        var newSearch = "sub:" + $scope.filterBySubMapper(sub);

        if ($scope.user.selectedSub) {
          // if selected populated, that means there was a search before...remove that first 
          $scope.removeExistingSearchFromSearch(existingSearch);
        }

        if ($scope.user.selectedSub === sub) {
          // if same thing was clicked again...already been remove from search...just reset vars
          $scope.user.selectedSub = null;
        } else {
          // this is a new search, add to search
          $scope.prepSearchForNewSearch();
          $scope.addNewSearchToSearch(newSearch);
          $scope.user.selectedSub = sub;
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
        var existingSearch = "line:" + $scope.user.selectedLine;
        var newSearch = "line:" + line;

        if ($scope.user.selectedLine) {
          // if selected populated, that means there was a search before...remove that first 
          $scope.removeExistingSearchFromSearch(existingSearch);
        }

        if ($scope.user.selectedLine === line) {
          // if same thing was clicked again...already been remove from search...just reset vars
          $scope.user.selectedLine = null;
        } else {
          // this is a new search, add to search
          $scope.prepSearchForNewSearch();
          $scope.addNewSearchToSearch(newSearch);
          $scope.user.selectedLine = line;
        }

        $scope.resetSort();
      };

      $scope.filterByPosition = function (position) {
        var existingSearch = "position:" + $scope.user.selectedPosition;
        var newSearch = "position:" + position;

        if ($scope.user.selectedPosition) {
          // if selected populated, that means there was a search before...remove that first 
          $scope.removeExistingSearchFromSearch(existingSearch);
        }

        if ($scope.user.selectedPosition === position) {
          // if same thing was clicked again...already been remove from search...just reset vars
          $scope.user.selectedPosition = null;
        } else {
          // this is a new search, add to search
          $scope.prepSearchForNewSearch();
          $scope.addNewSearchToSearch(newSearch);
          $scope.user.selectedPosition = position;
        }

        $scope.resetSort();
      };

      $scope.resetSort = function (newSearch) {
        //$scope.sortDescFirst('p');
      };

      $scope.addNewSearchToSearch = function (newSearch) {
        $scope.user.searchText = $scope.user.searchText + newSearch;
      };

      $scope.removeExistingSearchFromSearch = function (existingSearch) {
        $scope.user.searchText = $scope.user.searchText.replace(", " + existingSearch, "");
        $scope.user.searchText = $scope.user.searchText.replace(existingSearch + ", ", "");
        $scope.user.searchText = $scope.user.searchText.replace(existingSearch, "");
      };

      $scope.prepSearchForNewSearch = function () {
        if ($scope.user.searchText) {
          $scope.user.searchText = $scope.user.searchText + ", ";
        } else {
          $scope.user.searchText = "";
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
        $scope.user.searchText = null;
        $scope.user.selectedTeam = null;
        $scope.user.selectedPosition = null;
        $scope.user.selectedLine = null;
        $scope.user.selectedSub = null;
      };

      $scope.calcWinPct = function () {
        angular.forEach($scope.data.goalieStats, function (item) {
          item.winPercent = item.w / item.gp;
        })
      };

      $scope.initializeScopeVariables = function () {

        $scope.teams = [
          "Bill Brown",
          "Hunt's Ace",
          "LAB/PSI",
          "Zas Ent",
          "DPKZ",
          "Villanova",
          "Glover",
          "D&G"
        ];

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

        $scope.data = {
          selectedSeasonId: -1,
          selectedPlayoffs: false,
          seasonName: "not set",
          seasonTypeName: "not set",
          goalieStats: [],
          goalieStatsDataGoodThru: "n/a",
          villaExchangeRateOn: false,
          villaExchangeRate: 1
        };

        $scope.requests = {
          goalieStatsLoaded: false,
          goalieStatsDataGoodThruLoaded: false
        };

        $scope.user = {
          searchText: null,
          selectedTeam: null,
          selectedPosition: null,
          selectedLine: null,
          selectedSub: null
        };
      };

      $scope.getForWebGoalieStats = function (seasonId, playoffs) {
        //$scope.initializeScopeVariables();

        var retrievedType = "GoalieStats";
        dataServiceForWebGoalieStats.listForWebGoalieStats(seasonId, playoffs).$promise.then(
          function (result) {
            // service call on success
            if (result && result.length && result.length > 0) {

              angular.forEach(result, function (item) {

                if ($scope.data.villaExchangeRateOn && item.player === "Brad Villa") {
                  item.ga = Math.round(item.ga * $scope.data.villaExchangeRate) + "*";
                  item.gaa = item.gaa * $scope.data.villaExchangeRate;
                }
                $scope.data.goalieStats.push(item);
              });

              $scope.calcWinPct();
              $scope.requests.goalieStatsLoaded = true;

              alertService.successRetrieval(retrievedType, $scope.data.goalieStats.length);

            } else {
              // results not successful
              alertService.errorRetrieval(retrievedType, result.reason);
            }
          }
        );

        dataServiceForWebGoalieStats.getForWebGoalieStatsDataGoodThru(seasonId).$promise.then(
          function (result) {
            // service call on success
            if (result && result.gt) {

              $scope.data.goalieStatsDataGoodThru = result.gt;
              $scope.requests.goalieStatsDataGoodThruLoaded = true;

              alertService.successRetrieval("GoalieStatsGoodThru", 1);

            } else {
              // results not successful
              alertService.errorRetrieval("GoalieStatsGoodThru", result.reason);
            }
          }
        );
      };

      $scope.getSettings = function () {
        var retrievedType = "Settings";

        dataServiceSettings.listSettings().$promise.then(
          function (result) {
            // service call on success
            if (result && result.length > -1) {
              // there can be no settings, so no length > 0

              angular.forEach(result, function (item) {
                if (item.settingName === "VillaExchangeRateOn") {
                  if (item.settingValue === "1" || item.settingValue === 1) {
                    $scope.data.villaExchangeRateOn = true;
                  } else {
                    $scope.data.villaExchangeRateOn = false;
                  }
                }

                if (item.settingName === "VillaExchangeRate") {
                  $scope.data.villaExchangeRate = parseFloat(item.settingValue, 10);
                }
              });

              alertService.successRetrieval(retrievedType, 1);

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
        $scope.getSettings();

        //TODO make this a user selection
        if ($routeParams.seasonId === null) {
          $scope.data.selectedSeasonId = constCurrentSeasonId;
          $scope.data.selectedPlayoffs = false;
        } else {
          $scope.data.selectedSeasonId = $routeParams.seasonId;
          $scope.data.selectedPlayoffs = $routeParams.playoffs;
        }

        // TODO get this from a service
        if ($scope.data.selectedPlayoffs == "true") {
          $scope.data.seasonTypeName = "Playoffs";
        } else {
          $scope.data.seasonTypeName = "Regular Season";
        }

        if ($scope.data.selectedSeasonId == constCurrentSeasonId.toString()) {
          $scope.data.seasonName = "2015 - 2016";
        } else {
          $scope.data.seasonName = "not mapped";
        }

        $scope.getForWebGoalieStats($scope.data.selectedSeasonId, $scope.data.selectedPlayoffs);
        $timeout(function () {
          $scope.sortAscOnly('gaa');
          $scope.filterBySub("Without");
        }, 0);  // using timeout so it fires when done rendering
      };

      $scope.activate();
    }
  ]
);