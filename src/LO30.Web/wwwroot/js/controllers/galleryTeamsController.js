'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('galleryTeamsController',
    function ($log, $scope, $routeParams, $timeout, apiService, criteriaServiceResolved, screenSize, broadcastService, externalLibService, Lightbox) {
      $scope.Lightbox = Lightbox;

      var _ = externalLibService._;

      $scope.initializeScopeVariables = function () {

        $scope.local = {
          selectedSeasonId: 56,
          teams: [],
          fetchTeamsCompleted: false
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

      $scope.activate = function () {

        $scope.initializeScopeVariables();

        if ($routeParams.seasonId) {

          $scope.local.selectedSeasonId = parseInt($routeParams.seasonId, 10);

          criteriaServiceResolved.season.setById($scope.local.selectedSeasonId);
        }

        $scope.local.criteriaSeason = criteriaServiceResolved.season.get();

        $scope.local.criteriaSeasonType = criteriaServiceResolved.seasonType.get();

        $scope.local.criteriaGame = criteriaServiceResolved.game.get();

        $scope.fetchTeams($scope.local.selectedSeasonId);

      };

      $scope.activate();
    }
);