'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('adminSettingsController',
  [
    '$scope',
    'dataServiceSettings',
    function ($scope, dataServiceSettings) {

      $scope.initializeScopeVariables = function () {

        $scope.data = {
          settings: []
        };

        $scope.requests = {
          settingsLoaded: false
        };

        $scope.user = {
          wantsToSaveSettings: false
        };
      };

      $scope.getSettings = function () {
        var retrievedType = "Settings";

        $scope.initializeScopeVariables();

        dataServiceSettings.listSettings().$promise.then(
          function (result) {
            // service call on success
            if (result && result.length && result.length > 0) {

              angular.forEach(result, function (item) {
                $scope.data.settings.push(item);
              });

              $scope.requests.settingsLoaded = true;

              alertService.successRetrieval(retrievedType, $scope.data.settings.length);

            } else {
              // results not successful
              alertService.errorRetrieval(retrievedType, result.reason);
            }
          }
        );
      };

      $scope.setWatches = function () {
      };

      $scope.activate = function () {
        $scope.initializeScopeVariables();
        $scope.setWatches();
        $scope.getSettings();
        $timeout(function () {
        }, 0);  // using timeout so it fires when done rendering
      };

      $scope.activate();
    }
  ]
);

