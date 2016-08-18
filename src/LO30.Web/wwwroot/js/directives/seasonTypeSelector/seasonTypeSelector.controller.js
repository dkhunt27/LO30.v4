'use strict';

angular.module('lo30NgApp')
  .controller('lo30SeasonTypeSelectorController',
  [
    '$log',
    '$scope',
    '$state',
    'criteriaService',
    function ($log, $scope, $state, criteriaService) {

      $scope.changeSeasonType = function () {

        criteriaService.seasonTypes.setById($scope.selectedSeasonTypeId);
        
        // update params object with new season type
        $state.params.seasonTypeId = $scope.selectedSeasonTypeId;

        // Update the URL without reloading the controller
        $state.go($state.current.name, $state.params,
        {
          location: 'replace', //  update url and replace
          inherit: false,
          notify: false
        });
      };

      $scope.activate = function () {

        var seasonType = criteriaService.seasonTypes.get();

        $scope.selectedSeasonTypeId = seasonType.seasonTypeId;

      };

      $scope.activate();
    }
  ]
);

