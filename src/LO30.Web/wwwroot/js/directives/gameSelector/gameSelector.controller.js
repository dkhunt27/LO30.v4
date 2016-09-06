'use strict';

angular.module('lo30NgApp')
  .controller('lo30GameSelectorController',
  [
    '$log',
    '$scope',
    '$state',
    'criteriaService',
    function ($log, $scope, $state, criteriaService) {

      $scope.changeGame = function (gameId) {
        criteriaService.games.setById(gameId);

        // update params object with new game
        $state.params.gameId = gameId;

        // Update the URL without reloading the controller
        $state.go($state.current.name, $state.params,
        {
          location: 'replace', //  update url and replace
          inherit: false,
          notify: false
        });
      };

      $scope.activate = function () {

        $scope.games = criteriaService.games.get();
      };

      $scope.activate();
    }
  ]
);

