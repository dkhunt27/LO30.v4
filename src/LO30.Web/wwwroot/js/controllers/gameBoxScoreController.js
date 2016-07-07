'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('gameBoxScoreController',
    function ($scope, $state, $stateParams, externalLibService, criteriaService, broadcastService, returnUrlService) {

      var _ = externalLibService._;

      $scope.initializeScopeVariables = function () {

        $scope.local = {
          selectedGameId: 3480,
          selectedSeasonId: 56
        };
      };


      $scope.setWatches = function () {
        $scope.$on(broadcastService.events().seasonSet, function () {

          $scope.fetchData();

        });

        $scope.$on(broadcastService.events().seasonTypeSet, function () {

          $scope.fetchData();

        });
      };

      $scope.setReturnUrlForCriteriaSelector = function () {

        var currentUrl = $state.href($state.current.name, $state.params, { absolute: false });

        returnUrlService.set(currentUrl);

      };

      $scope.activate = function () {

        $scope.initializeScopeVariables();

        $scope.setWatches();

        $scope.setReturnUrlForCriteriaSelector();

        $scope.local.criteriaSeasonId = parseInt($routeParams.seasonId, 10);

        $scope.local.criteriaSeasonTypeId = parseInt($routeParams.seasonTypeId, 10);

        if ($routeParams.gameId) {

          $scope.local.selectedGameId = parseInt($routeParams.gameId, 10);

        }

      };

      $scope.activate();
    }
);