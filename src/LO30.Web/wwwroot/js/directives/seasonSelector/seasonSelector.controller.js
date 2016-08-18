'use strict';

angular.module('lo30NgApp')
  .controller('lo30SeasonSelectorController',
  [
    '$log',
    '$scope',
    '$state',
    'criteriaService',
    function ($log, $scope, $state, criteriaService) {

      $scope.changeSeason = function(seasonId) {
        criteriaService.seasons.setById(seasonId);

        $scope.decades = criteriaService.decades.get();

        // update params object with new season
        $state.params.seasonId = seasonId;

        // Update the URL without reloading the controller
        $state.go($state.current.name, $state.params,
        {
          location: 'replace', //  update url and replace
          inherit: false,
          notify: false
        });
      };

      $scope.activate = function () {

        $scope.decades = criteriaService.decades.get();
      };

      $scope.activate();
    }
  ]
);

