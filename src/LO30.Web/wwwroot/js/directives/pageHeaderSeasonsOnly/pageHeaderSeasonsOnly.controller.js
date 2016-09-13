'use strict';

angular.module('lo30NgApp')
  .controller('lo30PageHeaderSeasonsOnlyController',
  [
    '$log',
    '$scope',
    '$state',
    'criteriaService',
    'broadcastService',
    'screenSize',
    function ($log, $scope, $state, criteriaService, broadcastService, screenSize) {

      var vm = this;

      var buildSeasonNameToDisplay = function (seasonName) {
        var display = seasonName;

        if (screenSize.is('xs, sm')) {

          display = seasonName.replace(/.-.\d\d/, "-");

        }

        return display;
      };

      $scope.determineNgClass = function () {

        var ngClass = "";

        if (screenSize.is('xs, sm')) {

          ngClass = "navbar-title navbar-title-mobile";

        } else if (screenSize.is('md')) {

          ngClass = "navbar-title";

        } else {

          ngClass = "navbar-title";

        }

        return ngClass;
      };

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

          $scope.seasonNameToDisplay = buildSeasonNameToDisplay($scope.season.seasonName);

        });

      };


      vm.$onInit = function () {

        $scope.seasonCriteriaPanelOpen = false;
        $scope.pageTitle = $state.current.data.pageTitle;

        $scope.season = criteriaService.seasons.get();

        $scope.seasonNameToDisplay = buildSeasonNameToDisplay($scope.season.seasonName);

        setWatches();
      };

    }
  ]
);

