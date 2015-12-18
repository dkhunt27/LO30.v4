'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('lo30CriteriaSelectorController',
  [
    '$log',
    '$scope',
    'alertService',
    'externalLibService',
    'dataServiceSeasons',
    'istevenMultiSelectService',
    'valSelectedSeason',
    function ($log, $scope, alertService, externalLibService, dataServiceSeasons, istevenMultiSelectService, valSelectedSeason) {
      var _ = externalLibService._;

      $scope.initializeScopeVariables = function () {

        $scope.data = {
          seasons: [],
          selectedSeason: {}
        };

        $scope.events = {
          seasonsProcessing: false,
          seasonsProcessed: false,
          userChangingSeason: false
        };
      };

      $scope.listSeasons = function () {
        var retrievedType = "Seasons";

        $scope.events.seasonsProcessing = true;
        $scope.events.seasonsProcessed = false;
        $scope.data.seasons = [];

        dataServiceSeasons.listSeasons().then(
          function (fulfilled) {
            // service call on success
            if (fulfilled) {

              $scope.data.seasons = fulfilled;

              $scope.events.seasonsProcessing = false;
              $scope.events.seasonsProcessed = true;

              //alertService.successRetrieval(retrievedType, 1);
              $log.debug(retrievedType, fulfilled);


              if (!$scope.data.selectedSeason || !$scope.data.selectedSeason.seasonName) {
                // default selected season to the current season
                var found = _.find($scope.data.seasons, function (season) { return season.isCurrentSeason === true; });
                $scope.data.selectedSeason = found;
                //$scope.data.seasons = istevenMultiSelectService.tickItemInList(found, $scope.data.seasons, 'seasonId');
                //valSelectedSeason = $scope.data.selectedSeason[0];
              }


            } else {
              // results not successful
              alertService.errorRetrieval(retrievedType, fulfilled.reason);
            }
          },
          function (rejected) {
            alertService.errorRetrieval(retrievedType, rejected);
          }
        );
      };

      $scope.userWantsToChangeSeason = function () {
        $scope.events.userChangingSeason = true;
      };

      $scope.activate = function () {
        $scope.initializeScopeVariables();
        $scope.listSeasons();
      };

      $scope.activate();
    }
  ]
);

