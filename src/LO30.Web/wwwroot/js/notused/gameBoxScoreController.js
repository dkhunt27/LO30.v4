'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('gameBoxScoreController',
    function ($scope, $state, externalLibService, criteriaService, broadcastService, returnUrlService) {

      var _ = externalLibService._;

      $scope.initializeScopeVariables = function () {

        $scope.local = {
          selectedGameId: 3480,
          selectedSeasonId: 56
        };
      };


      $scope.setWatches = function () {

      };

      $scope.setReturnUrlForCriteriaSelector = function () {

        var currentUrl = $state.href($state.current.name, $state.params, { absolute: false });

        returnUrlService.set(currentUrl);

      };

      $scope.activate = function () {

        $scope.initializeScopeVariables();

        $scope.setWatches();

        $scope.setReturnUrlForCriteriaSelector();

        if ($state.params.gameId) {

          $scope.local.selectedGameId = parseInt($state.params.gameId, 10);

        }

      };

      $scope.activate();
    }
);