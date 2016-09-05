'use strict';

angular.module('lo30NgApp')
  .controller('statsPlayersController', function ($window, $scope, $state, $timeout, $q, $compile, criteriaService, apiService, screenSize, externalLibService, broadcastService, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {

    var _ = externalLibService._;
    var sjv = externalLibService.sjv;

    var vm = this;

    var fetchTeams = function (seasonId) {

      var teams = [];

      apiService.teams.listForSeasonId(seasonId).then(function (fulfilled) {

        vm.teams = buildTeamsToDisplay(fulfilled);

      }).finally(function () {

        // do nothing

      });
    };

    var buildTeamsToDisplay = function (teams) {

      var teamsToDisplay = teams.map(function (item, index) {

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

      return teamsToDisplay;
    };

    var fetchData = function (seasonId, seasonTypeId, playerType, initial) {

      fetchTeams(seasonId);

      $window.dtSkatersStats.ajax.url("../api/playerstatteams/seasons/" + vm.seasonId + "/seasonTypes/" + vm.seasonTypeId + "?key=1").load();
    };

    $scope.removeSearch = function () {
      $scope.searchText = null;
      $window.dtSkatersStats
       .search("")
       .draw();
    };

    $scope.performSearch = function () {

      var searchOn = $scope.searchText ? $scope.searchText : "";

      $window.dtSkatersStats
       .search(searchOn)
       .draw();
    };

    var performColumnSearch = function (colIndex, value) {
      $window.dtSkatersStats
       .columns(colIndex)
       .search(value)
       .draw();
    };

    var removeColumnSearch = function (colIndex) {
      $window.dtSkatersStats
       .columns(colIndex)
       .search("")
       .draw();
    };

    var searchOn = function (colIndex, searchToProcess, searchToSave) {

      if (searchToSave) {
        // if searchToSave, that means there was a filter before...remove that first 
        removeColumnSearch(colIndex);
      }

      if (searchToProcess === searchToSave) {
        // if same thing was clicked again...already been remove from search...just reset vars
        searchToSave = null;
      } else {
        // this is a new search, add to search
        searchToSave = searchToProcess;

        performColumnSearch(colIndex, searchToProcess);
      }

      return searchToSave;
    }

    $scope.filterByTeam = function (team) {
      var teamColIndex = 10;

      var teamToSearchOn;
      if (screenSize.is('xs, sm')) {

        teamToSearchOn = team.teamCode;

      } else if (screenSize.is('md')) {

        teamToSearchOn = team.teamNameShort;

      } else {

        teamToSearchOn = team.teamNameShort;

      }

      vm.selectedTeam = searchOn(teamColIndex, teamToSearchOn, vm.selectedTeam);

    };

    var subMapper = function(sub) {
      var subMapped;

      if (sub === "With") {
        subMapped = "Y";
      } else if (sub === "Without") {
        subMapped = "N";
      } else if (sub === "Y") {
        subMapped = "With";
      } else if (sub === "N") {
        subMapped = "Without";
      } else {
        subMapped = null;
      }

      return subMapped;
    }

    $scope.filterBySub = function (sub) {
      var subColIndex = 13;

      var subToSearchOn = subMapper(sub);

      var selectedSubToSearchOn = subMapper(vm.selectedSub);

      selectedSubToSearchOn = searchOn(subColIndex, subToSearchOn, selectedSubToSearchOn);

      vm.selectedSub = subMapper(selectedSubToSearchOn);
    };

    $scope.filterByLine = function (line) {
      var lineColIndex = 12;

      vm.selectedLine = searchOn(lineColIndex, line, vm.selectedLine);
    };

    $scope.filterByPosition = function (position) {
      var posColIndex = 11;

      vm.selectedPosition = searchOn(posColIndex, position, vm.selectedPosition);
    };

    var setWatches = function () {

      $scope.$on(broadcastService.events().seasonSet, function () {

        var season = criteriaService.seasons.get();

        vm.seasonId = season.seasonId;

        fetchData(vm.seasonId, vm.seasonTypeId, vm.playerType, false);

      });

      $scope.$on(broadcastService.events().seasonTypeSet, function () {

        var seasonType = criteriaService.seasonTypes.get();

        vm.seasonTypeId = seasonType.seasonTypeId;

        fetchData(vm.seasonId, vm.seasonTypeId, vm.playerType, false);

      });

      $scope.$watch(function () { return $state.params.playerType; }, function (value) {
        vm.playerType = value;
      });

      $scope.$watch('searchText', function (value, oldValue) {

        if (value !== oldValue) {
          $scope.performSearch(value);
        }
      });
    };

    vm.$onInit = function () {

      vm.dataLoaded = false;

      vm.positions = [
        "F",
        "D",
        "G"
      ];

      vm.subs = [
        "With",
        "Without",
      ];

      vm.lines = [
        "1",
        "2",
        "3",
      ];

      var season = criteriaService.seasons.get();

      vm.seasonId = season.seasonId;

      var seasonType = criteriaService.seasonTypes.get();

      vm.seasonTypeId = seasonType.seasonTypeId;

      vm.playerType = $state.params.playerType;

      $scope.filterBySub("Without");

      fetchData(vm.seasonId, vm.seasonTypeId, vm.playerType, true);

      $timeout(function () {
        setWatches();
      }, 100);
    };
  });
