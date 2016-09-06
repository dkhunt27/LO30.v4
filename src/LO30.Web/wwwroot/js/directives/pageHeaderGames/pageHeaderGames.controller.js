'use strict';

angular.module('lo30NgApp')
  .controller('lo30PageHeaderGamesController',
  [
    '$log',
    '$scope',
    '$state',
    'criteriaService',
    'broadcastService',
    function ($log, $scope, $state, criteriaService, broadcastService) {

      var vm = this;

      $scope.toggleSeasonCriteriaPanel = function () {
        $scope.seasonCriteriaPanelOpen = !$scope.seasonCriteriaPanelOpen
      }

      $scope.toggleGameCriteriaPanel = function () {
        $scope.gameCriteriaPanelOpen = !$scope.gameCriteriaPanelOpen
      }

      var setWatches = function () {

        $scope.$watch(function () { return $state.params.seasonId; }, function (value) {

          if (sjv.isNotEmpty(value)) {

            criteriaService.seasons.setById($state.params.seasonId);
          }

        });

        $scope.$watch(function () { return $state.params.gameId; }, function (value) {

          if (sjv.isNotEmpty(value)) {

            criteriaService.games.setById($state.params.gameId);
          }

        });

        $scope.$on(broadcastService.events().seasonSet, function () {

          $scope.season = criteriaService.seasons.get();

        });

        $scope.$on(broadcastService.events().gameSet, function () {

          $scope.game = criteriaService.games.get();

        });
      };


      vm.$onInit = function () {

        $scope.seasonCriteriaPanelOpen = false;
        $scope.seasonTypeCriteriaPanelOpen = false;
        $scope.pageTitle = $state.current.data.pageTitle;

        $scope.season = criteriaService.seasons.get();

        $scope.seasonType = criteriaService.seasonTypes.get();

        setWatches();
      };

    }
  ]
);

