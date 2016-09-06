'use strict';

angular.module('lo30NgApp')
  .controller('lo30PageHeaderSeasonsController',
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

      $scope.toggleSeasonTypeCriteriaPanel = function () {
        $scope.seasonTypeCriteriaPanelOpen = !$scope.seasonTypeCriteriaPanelOpen
      }

      var setWatches = function () {

        $scope.$watch(function () { return $state.params.seasonId; }, function (value) {

          if (sjv.isNotEmpty(value)) {

            criteriaService.seasons.setById($state.params.seasonId);
          }

        });

        $scope.$watch(function () { return $state.params.seasonTypeId; }, function (value) {

          if (sjv.isNotEmpty(value)) {

            criteriaService.seasonTypes.setById($state.params.seasonTypeId);
          }

        });

        $scope.$on(broadcastService.events().seasonSet, function () {

          $scope.season = criteriaService.seasons.get();

        });

        $scope.$on(broadcastService.events().seasonTypeSet, function () {

          $scope.seasonType = criteriaService.seasonTypes.get();

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

