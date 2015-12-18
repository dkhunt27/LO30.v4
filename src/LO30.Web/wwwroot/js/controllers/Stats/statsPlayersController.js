'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('statsPlayersController',
  function ($scope, $timeout, $routeParams, alertService, dataApiService) {

    $scope.getPlayerStatsForSeasonId = function (seasonId) {
      var retrievedType = "PlayerStats";

      // GET THIS PLAYERS GAME STATS FOR THIS SEASON
      $scope.playerGameStatsFetching = false;
      dataApiService.listPlayerGameStatsForSeasonId(seasonId).then(function (fulfilled) {
        angular.copy(fulfilled, $scope.playerGameStats);
      }).finally(function(){
        $scope.playerGameStatsFetching = true;
      });

      // GET THIS PLAYERS TEAM STATS FOR THIS SEASON
      $scope.playerTeamStatsFetching = false;
      dataApiService.listPlayerTeamStatsForSeasonId(seasonId).then(function (fulfilled) {
        angular.copy(fulfilled, $scope.playerTeamStats);
      }).finally(function(){
        $scope.playerTeamStatsFetching = true;
      });
    };

    $scope.activate = function () {

      $scope.playerGameStats = [];
      $scope.playerGameStatsFetching = false;

      $scope.playerTeamStats = [];
      $scope.playerTeamStatsFetching = false;

      $scope.getPlayerStatsForSeasonId($scope.selectedSeason.seasonId);
    };

    $scope.activate();
  }
);