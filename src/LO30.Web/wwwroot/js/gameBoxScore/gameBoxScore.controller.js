'use strict';

angular.module('lo30NgApp')
  .controller('gameBoxScoreController',
    function ($scope, $state, externalLibService, criteriaService, broadcastService) {

      var _ = externalLibService._;

      var vm = this;

      var setWatches = function () {

        $scope.$on(broadcastService.events().seasonSet, function () {

          var season = criteriaService.seasons.get();

          vm.seasonId = season.seasonId;

          //fetchData(vm.seasonId, vm.seasonTypeId, vm.playerType);

        });

        $scope.$on(broadcastService.events().seasonTypeSet, function () {

          var seasonType = criteriaService.seasonTypes.get();

          vm.seasonTypeId = seasonType.seasonTypeId;

          //fetchData(vm.seasonId, vm.seasonTypeId, vm.playerType);

        });

        $scope.$watch(function () { return $state.params.gameId; }, function (value) {
          $scope.local.selectedGameId = parseInt($state.params.gameId, 10);
        });

      };

      vm.$onInit = function () {

        $scope.local = {
          selectedGameId: 3480,
          selectedSeasonId: 56
        };

        var season = criteriaService.seasons.get();

        vm.seasonId = season.seasonId;

        var seasonType = criteriaService.seasonTypes.get();

        vm.seasonTypeId = seasonType.seasonTypeId;

        $scope.local.selectedGameId = parseInt($state.params.gameId, 10);

      };
    }
);