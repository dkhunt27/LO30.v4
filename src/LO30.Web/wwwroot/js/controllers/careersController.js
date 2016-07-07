'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('careersController',
    function ($scope, $state, $stateParams, $timeout, apiService, screenSize, externalLibService, criteriaService, broadcastService, returnUrlService) {

      var _ = externalLibService._;

      $scope.initializeScopeVariables = function () {

        $scope.local = {
          screenSizeIsDesktop: false,
          screenSizeIsTablet: false,
          screenSizeIsMobile: false,
          selectedPlayerType: "skater",
          playerStatCareers: [],
          playerStatCareersToDisplay: [],
          fetchPlayerStatCareersCompleted: false,
          searchText: null,

          criteriaSeasonId: -1,
          criteriaSeasonTypeId: -1
        };
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

        $scope.local.fetchPlayerStatCareersCompleted = false;

        $scope.local.playerStatCareers = [];

        var apiServiceType = "playerStatCareers";

        if ($scope.local.selectedPlayerType === "goalie") {

          apiServiceType = "goalieStatCareers";

        }

        apiService[apiServiceType].list().then(function (fulfilled) {

          $scope.local.playerStatCareers = _.sortBy(fulfilled, function(item) { return item.points * -1; });

          $scope.buildPlayerStatCareersToDisplay();

        }).finally(function () {

          $scope.local.fetchPlayerStatCareersCompleted = true;

        });
      };

      $scope.buildPlayerStatCareersToDisplay = function () {

        $scope.local.playerStatCareersToDisplay = $scope.local.playerStatCareers.map(function (item, index) {

          item.rank = index + 1;

          if ($scope.local.screenSizeIsMobile) {

            item.playerNameToDisplay = item.playerFirstName + ' ' + item.playerLastName;

            if (item.playerSuffix) {
              item.playerNameToDisplay = item.playerNameToDisplay + ' ' + item.playerSuffix;
            }

          } else if ($scope.local.screenSizeIsTablet) {

            item.playerNameToDisplay = item.playerFirstName + ' ' + item.playerLastName;

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

      $scope.fetchData = function () {

        $scope.fetchPlayerStatTeams();
      };

      $scope.setWatches = function () {
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
        }, 0);  
      };

      $scope.activate();
    }
);