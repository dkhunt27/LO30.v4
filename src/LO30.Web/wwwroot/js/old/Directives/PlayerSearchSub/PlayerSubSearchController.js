'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('lo30PlayerSubSearchController',
  [
    '$scope',
    '$timeout',
    'dataServiceLo30Constants',
    'alertService',
    'dataServicePlayersSubSearch',
    function ($scope, $timeout, dataServiceLo30Constants, alertService, dataServicePlayersSubSearch) {

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

      $scope.initializeScopeVariables = function () {

        $scope.positions = dataServiceLo30Constants.getAvailablePositions();

        $scope.data = {
          playersSearch: []
        };

        $scope.requests = {
          playersSearchLoaded: false
        };

        $scope.user = {
          searchText: null,
          selectedTeam: null,
          selectedPosition: null,
          selectedLine: null,
          selectedSub: null
        };
      };

      $scope.getPlayersSearch = function (position, ratingMin, ratingMax) {
        var retrievedType = "Players";

        $scope.initializeScopeVariables();

        dataServicePlayersSubSearch.listByPositionRating(position, ratingMin, ratingMax).$promise.then(
          function (result) {
            // service call on success
            if (result && result.length && result.length > 0) {

              angular.forEach(result, function (item) {
                $scope.data.playersSearch.push(item);
              });

              $scope.requests.playersSearchLoaded = true;

              alertService.successRetrieval(retrievedType, $scope.data.playersSearch.length);

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
        var position = "F";
        var ratingMin = "1.1";
        var ratingMax = "1.8";
        $scope.initializeScopeVariables();
        $scope.setWatches();
        $scope.getPlayersSearch(position, ratingMin, ratingMax);
        $timeout(function () {
          //$scope.sortDescOnly('p');
          //$scope.filterBySub("Without");
        }, 0);  // using timeout so it fires when done rendering
      };

      $scope.activate();
    }
  ]
);