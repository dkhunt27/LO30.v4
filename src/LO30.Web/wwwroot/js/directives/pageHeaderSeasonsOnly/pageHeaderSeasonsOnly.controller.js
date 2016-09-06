'use strict';

angular.module('lo30NgApp')
  .controller('lo30PageHeaderSeasonsOnlyController',
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

      var setWatches = function () {

        $scope.$watch(function () { return $state.params.seasonId; }, function (value) {

          if (sjv.isNotEmpty(value)) {

            criteriaService.seasons.setById($state.params.seasonId);
          }

        });

        $scope.$on(broadcastService.events().seasonSet, function () {

          $scope.season = criteriaService.seasons.get();

        });

      };


      vm.$onInit = function () {

        $scope.seasonCriteriaPanelOpen = false;
        $scope.pageTitle = $state.current.data.pageTitle;

        $scope.season = criteriaService.seasons.get();

        setWatches();
      };

    }
  ]
);

