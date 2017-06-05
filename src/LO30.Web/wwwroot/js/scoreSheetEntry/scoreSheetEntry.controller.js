'use strict';

angular.module('lo30NgApp')
  .controller('scoreSheetEntryController', function ($log, $scope, $state, criteriaService, apiService, screenSize, externalLibService, broadcastService) {

    var _ = externalLibService._;
    var sjv = externalLibService.sjv;

    var vm = this;

    var isTeamGameRosterLocked = function () {
      var locked = true;

      // if user is admin, should be editable/not locked

      // otherwise, if game data hasn't been processed...then it is editable/not locked
      if ($scope.data.teamGameRosterHome && $scope.data.teamGameRosterHome.length > 0) {
        locked = $scope.data.teamGameRosterHome[0].gameProcessed;
      }

      return locked;
    };

    var fetchPlayers = function () {

      vm.playersLoaded = false;

      vm.players = [];

      apiService.players.list().then(function (fulfilled) {

        vm.players = _.sortBy(fulfilled, function (item) { return item.lastName; });

        //vm.players = buildPlayersToDisplay(vm.players);

      }).finally(function () {

        vm.playersLoaded = true;

      });
    };

    var fetchGames = function (seasonId) {

      vm.gamesLoaded = false;

      vm.games = [];

      apiService.games.listForSeasonId(seasonId).then(function (fulfilled) {

        vm.games = _.sortBy(fulfilled, function (item) { return item.gameId * -1; });

        vm.selectedGame = _.findWhere(vm.games, {gameId: vm.gameId});
        //vm.games = buildGamesToDisplay(vm.games);

      }).finally(function () {

        vm.gamesLoaded = true;

      });
    };

    var fetchTeamRosters = function (teamId, homeTeam) {

      var teamRostersType = "Away";

      if (homeTeam) {
        teamRostersType = "Home";
      }

      vm["teamRosters" + teamRostersType + "Loaded"] = false;

      vm["teamRosters" + teamRostersType] = [];

      apiService.teamRosters.listForTeamId(teamId).then(function (fulfilled) {

        vm["teamRosters" + teamRostersType] = fulfilled;
        
      }).finally(function () {

        vm["teamRosters" + teamRostersType + "Loaded"] = true;

      });
    };

    var fetchDataByGameIdViaApiService = function (gameId, apiServiceName) {

      vm[apiServiceName + "Loaded"] = false;

      vm[apiServiceName] = [];

      apiService[apiServiceName].listForGameId(gameId).then(function (fulfilled) {

        vm[apiServiceName] = fulfilled;

      }).finally(function () {

        vm[apiServiceName + "Loaded"] = true;

      });
    };

    var fetchData = function (teamIdHome, teamIdAway, gameId) {

      fetchTeamRosters(teamIdHome, true);
      fetchTeamRosters(teamIdAway, false);
      fetchDataByGameIdViaApiService(gameId, "gameRosters");
      fetchDataByGameIdViaApiService(gameId, "scoreSheetEntryGoals");
      fetchDataByGameIdViaApiService(gameId, "scoreSheetEntryPenalties");
      fetchDataByGameIdViaApiService(gameId, "scoreSheetEntrySubs");
      fetchDataByGameIdViaApiService(gameId, "scoreSheetEntryProcessedGoals");
      fetchDataByGameIdViaApiService(gameId, "scoreSheetEntryProcessedPenalties");
      fetchDataByGameIdViaApiService(gameId, "scoreSheetEntryProcessedSubs");


    };

    var setWatches = function () {

      $scope.$on(broadcastService.events().seasonSet, function () {

        var season = criteriaService.seasons.get();

        vm.seasonId = season.seasonId;

        fetchGames(vm.seasonId);
      });

      $scope.$on(broadcastService.events().seasonTypeSet, function () {

        var seasonType = criteriaService.seasonTypes.get();

        vm.seasonTypeId = seasonType.seasonTypeId;
      });

      $scope.$watch(function () { return $state.params.gameId; }, function (value) {
        //$scope.data.gameIdSelected = parseInt($state.params.gameId, 10);
      });

      $scope.$watch(function () { return vm.gameTeamsLoaded; }, function (value) {
        if (value) {
          var gameTeamHome = _.find(vm.gameTeams, function (item) { return item.gameId === vm.gameId && item.homeTeam === true; });
          vm.teamIdHome = gameTeamHome.teamId;
          var gameTeamAway = _.find(vm.gameTeams, function (item) { return item.gameId === vm.gameId && item.homeTeam === false; });
          vm.teamIdAway = gameTeamAway.teamId;

          fetchData(vm.teamIdHome, vm.teamIdAway, vm.gameId);
        }
      });


      $scope.$watch(function () { return vm.teamRostersHomeLoaded; }, function (value) {
        if (value) {
          $log.debug("teamRostersHome", vm.teamRostersHome);
        }
      });
    };

    vm.$onInit = function () {

      var season = criteriaService.seasons.get();

      vm.seasonId = season.seasonId;

      var seasonType = criteriaService.seasonTypes.get();

      vm.seasonTypeId = seasonType.seasonTypeId;

      //vm.gameId = parseInt($state.params.gameId, 10);
      vm.gameId = 3616;
      
      fetchGames(vm.seasonId);

      fetchDataByGameIdViaApiService(vm.gameId, "gameTeams");

      fetchPlayers();

      setWatches();
    };
  });