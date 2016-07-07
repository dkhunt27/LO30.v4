'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('galleryTeamsController',
    function ($log, $scope, $state, $stateParams, $timeout, apiService, screenSize, externalLibService, Lightbox, criteriaService, broadcastService, returnUrlService) {
      $scope.Lightbox = Lightbox;

      var _ = externalLibService._;

      $scope.initializeScopeVariables = function () {

        $scope.local = {
          teams: [],
          fetchTeamsCompleted: false,

          criteriaSeasonId: -1,
          criteriaSeasonTypeId: -1
        };

        // lightbox is looking for images at $scope.images
        $scope.images = [];
      };

      $scope.fetchTeams = function (seasonId) {

        $scope.local.fetchTeamsCompleted = false;

        $scope.local.teams = [];

        apiService.teams.listForSeasonId(seasonId).then(function (fulfilled) {

          $scope.local.teams = fulfilled;

          $scope.buildImages();

        }).finally(function () {

          $scope.local.fetchTeamsCompleted = true;

        });
      };

      var removeUnwantedChars = function(text) {
        var newText = text.replace(/ /g,"");
        newText = newText.replace(/&/g,"");
        newText = newText.replace(/\//g,"");
        newText = newText.replace(/\./g,"");
        newText = newText.replace(/'/g,"");

        return newText;
      };

      $scope.buildImages = function () {

        $scope.images = $scope.local.teams.map(function (item) {

          var fileSeasonName = removeUnwantedChars(item.seasonName);
          var fileTeamName = removeUnwantedChars(item.teamNameLong);

          var filePath = "img/teams/" + fileSeasonName + "/" + fileTeamName + ".png";
          var filePathThumb = "img/teams/" + fileSeasonName + "/" + fileTeamName + "_tn.png";

          var image = {
            "url": filePath,
            "thumbUrl": filePathThumb
          };

          var teamNameToDisplay;
          if (screenSize.is('xs, sm')) {

            teamNameToDisplay = item.teamCode;

          } else if (screenSize.is('md')) {

            teamNameToDisplay = item.teamNameShort;

          } else {

            teamNameToDisplay = item.teamNameLong;

          }

          image.caption = item.seasonName + " " + teamNameToDisplay;
          image.thumbCaption = teamNameToDisplay;

          return image;
        });

        $log.debug("images", $scope.images)
      };

      $scope.openLightboxModal = function (index) {
        Lightbox.openModal($scope.images, index);
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

        $scope.fetchTeams($scope.local.selectedSeasonId);

      };

      $scope.activate();
    }
);