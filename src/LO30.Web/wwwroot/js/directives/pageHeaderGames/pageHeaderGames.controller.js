'use strict';

angular.module('lo30NgApp')
  .controller('lo30PageHeaderGamesController',
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

          $scope.seasonNameToDisplay = buildSeasonNameToDisplay($scope.season.seasonName);

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

        $scope.seasonNameToDisplay = buildSeasonNameToDisplay($scope.season.seasonName);

        $scope.seasonType = criteriaService.seasonTypes.get();

        setWatches();
      };

    }
  ]
);

