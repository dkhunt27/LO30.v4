'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('adminDataProcessingController',
  [
    '$scope',
    'adminDataProcessingService',
    'constCurrentSeasonId',
    function ($scope, adminDataProcessingService, constCurrentSeasonId) {
      $scope.dataModel = {
        action: "n/a",
        seasonId: constCurrentSeasonId,
        playoff: false,
        startingGameId: 3200,
        endingGameId: 3261
      };

      var defaultCount = {
        toProcess: -1,
        modified: -1,
        time: "n/a",
        error: null
      };

      $scope.processCount = {
        accessDbToJson: JSON.parse(JSON.stringify(defaultCount)),
        loadScoreSheetEntriesFromAccessDbToJson: JSON.parse(JSON.stringify(defaultCount)),
        processAll: JSON.parse(JSON.stringify(defaultCount)),
        processScoreSheetEntries: JSON.parse(JSON.stringify(defaultCount)),
        processScoreSheetEntriesIntoGameResults: JSON.parse(JSON.stringify(defaultCount)),
        processGameResultsIntoTeamStandings: JSON.parse(JSON.stringify(defaultCount)),
        processScoreSheetEntriesIntoPlayerStats: JSON.parse(JSON.stringify(defaultCount)),
        processPlayerStatsIntoWebStats: JSON.parse(JSON.stringify(defaultCount)),
        contextToJson: JSON.parse(JSON.stringify(defaultCount))
      }

      $scope.accessDbToJson = function () {
        $scope.dataModel.action = 'AccessDbToJson';
        $scope.processCount.accessDbToJson = defaultCount;
        $scope.processCount.accessDbToJson.time = "processing...";

        adminDataProcessingService.postAction($scope.dataModel).$promise
          .then(function (result) {
            // success
            $scope.processCount.accessDbToJson = result.results;
          },
          function (err) {
            // error
            alert("could not accessDbToJson:" + err);
          })
          .then(function () {
          });
      };

      $scope.loadScoreSheetEntriesFromAccessDbToJson = function () {
        $scope.dataModel.action = 'LoadScoreSheetEntriesFromAccessDbToJson';
        $scope.processCount.loadScoreSheetEntriesFromAccessDbToJson = defaultCount;
        $scope.processCount.loadScoreSheetEntriesFromAccessDbToJson.time = "processing...";

        adminDataProcessingService.postAction($scope.dataModel).$promise
          .then(function (result) {
            // success
            $scope.processCount.loadScoreSheetEntriesFromAccessDbToJson = result.results;
          },
          function (err) {
            // error
            alert("could not loadScoreSheetEntriesFromAccessDbToJson:" + err);
          })
          .then(function () {
          });
      };

      $scope.processAll = function () {
        $scope.dataModel.action = 'ProcessAll';
        $scope.processCount.processAll = defaultCount;
        $scope.processCount.processAll.time = "processing...";

        adminDataProcessingService.postAction($scope.dataModel).$promise
          .then(function (result) {
            // success
            $scope.processCount.ProcessAll = result.results;
          },
          function (err) {
            // error
            alert("could not ProcessAll:" + err);
          })
          .then(function () {
          });
      };

      $scope.processScoreSheetEntries = function () {
        $scope.dataModel.action = 'ProcessScoreSheetEntries';
        $scope.processCount.processScoreSheetEntries = defaultCount;
        $scope.processCount.processScoreSheetEntries.time = "processing...";

        adminDataProcessingService.postAction($scope.dataModel).$promise
          .then(function (result) {
            // success
            $scope.processCount.processScoreSheetEntries = result.results;
          },
          function (err) {
            // error
            alert("could not processScoreSheetEntries:" + err);
          })
          .then(function () {
          });
      };

      $scope.processScoreSheetEntriesIntoGameResults = function () {
        $scope.dataModel.action = 'ProcessScoreSheetEntriesIntoGameResults';
        $scope.processCount.processScoreSheetEntriesIntoGameResults = defaultCount;
        $scope.processCount.processScoreSheetEntriesIntoGameResults.time = "processing...";

        adminDataProcessingService.postAction($scope.dataModel).$promise
          .then(function (result) {
            // success
            $scope.processCount.processScoreSheetEntriesIntoGameResults = result.results;
          },
          function (err) {
            // error
            alert("could not processScoreSheetEntriesIntoGameResults:" + err);
          })
          .then(function () {
          });
      };

      $scope.processGameResultsIntoTeamStandings = function () {
        $scope.dataModel.action = 'ProcessGameResultsIntoTeamStandings';
        $scope.processCount.processGameResultsIntoTeamStandings = defaultCount;
        $scope.processCount.processGameResultsIntoTeamStandings.time = "processing...";

        adminDataProcessingService.postAction($scope.dataModel).$promise
          .then(function (result) {
            // success
            $scope.processCount.processGameResultsIntoTeamStandings = result.results;
          },
          function (err) {
            // error
            alert("could not processGameResultsIntoTeamStandings:" + err);
          })
          .then(function () {
          });
      };

      $scope.processScoreSheetEntriesIntoPlayerStats = function () {
        $scope.dataModel.action = 'ProcessScoreSheetEntriesIntoPlayerStats';
        $scope.processCount.processScoreSheetEntriesIntoPlayerStats = defaultCount;
        $scope.processCount.processScoreSheetEntriesIntoPlayerStats.time = "processing...";

        adminDataProcessingService.postAction($scope.dataModel).$promise
          .then(function (result) {
            // success
            $scope.processCount.processScoreSheetEntriesIntoPlayerStats = result.results;
          },
          function (err) {
            // error
            alert("could not processScoreSheetEntriesIntoPlayerStats:" + err);
          })
          .then(function () {
          });
      };

      $scope.processPlayerStatsIntoWebStats = function () {
        $scope.dataModel.action = 'ProcessPlayerStatsIntoWebStats';
        $scope.processCount.processPlayerStatsIntoWebStats = defaultCount;
        $scope.processCount.processPlayerStatsIntoWebStats.time = "processing...";

        adminDataProcessingService.postAction($scope.dataModel).$promise
          .then(function (result) {
            // success
            $scope.processCount.processPlayerStatsIntoWebStats = result.results;
          },
          function (err) {
            // error
            alert("could not processPlayerStatsIntoWebStats:" + err);
          })
          .then(function () {
          });
      };

      $scope.contextToJson = function () {
        $scope.dataModel.action = 'ContextToJson';
        $scope.processCount.contextToJson = defaultCount;
        $scope.processCount.contextToJson.time = "processing...";

        adminDataProcessingService.postAction($scope.dataModel).$promise
          .then(function (result) {
            // success
            $scope.processCount.contextToJson = result.results;
          },
          function (err) {
            // error
            alert("could not contextToJson:" + err);
          })
          .then(function () {
          });
      };
    }
  ]
);

