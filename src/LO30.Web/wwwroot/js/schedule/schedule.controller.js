'use strict';

angular.module('lo30NgApp')
  .controller('scheduleController', function ($log, $scope, $state, $timeout, $q, $compile, $location, criteriaService, apiService, screenSize, externalLibService, broadcastService, constScheduleTeamFeedBaseUrl) {

    var _ = externalLibService._;
    var sjv = externalLibService.sjv;

    var vm = this;

    var buildTeamFeedsToDisplay = function (teams) {

      var teamFeedsToDisplay = teams.map(function (item, index) {

        if (screenSize.is('xs, sm')) {

          item.teamNameToDisplay = item.teamCode;

        } else if (screenSize.is('md')) {

          item.teamNameToDisplay = item.teamNameShort;

        } else {

          item.teamNameToDisplay = item.teamNameShort;

        }

        var teamId = item.teamId;
        var scheduleTeamName = item.teamNameLong.replace(" ", "").replace("/", "").replace("-", "").replace(".", "").replace("&", "").replace("'", "");
        var scheduleSeasonName = item.seasonName.replace(" ", "");

        var host = $location.host();
        var port = $location.port();

        if (port != 80 || port != 443) {
          host = host + ":" + port
        }

        var teamFeed = {
          "teamNameToDisplay": item.teamNameToDisplay,
          "teamCode": item.teamCode,
          "teamNameLong": item.teamNameLong,
          "teamNameShort": item.teamNameShort,
          "teamFeedUrl": host + "/Schedule/TeamFeed/Seasons/" + vm.seasonId + "/Teams/" + teamId + "/LO30Schedule-" + scheduleTeamName + "-" + scheduleSeasonName
        };

        return teamFeed;
      });

      return teamFeedsToDisplay;
    };


    var fetchTeams = function (seasonId) {

      var teams = [];

      apiService.teams.listForSeasonId(seasonId).then(function (fulfilled) {

        vm.teamFeeds = buildTeamFeedsToDisplay(fulfilled);

      }).finally(function () {

        // do nothing

      });
    };

    var fetchData = function (seasonId, seasonTypeId) {
      fetchTeams(seasonId);
    };

    var setWatches = function () {

      $scope.$on(broadcastService.events().seasonSet, function () {

        var season = criteriaService.seasons.get();

        vm.seasonId = season.seasonId;

        fetchData(vm.seasonId, vm.seasonTypeId);

      });

      $scope.$on(broadcastService.events().seasonTypeSet, function () {

        var seasonType = criteriaService.seasonTypes.get();

        vm.seasonTypeId = seasonType.seasonTypeId;

        fetchData(vm.seasonId, vm.seasonTypeId);

      });
    };

    vm.$onInit = function () {

      var season = criteriaService.seasons.get();

      vm.seasonId = season.seasonId;

      var seasonType = criteriaService.seasonTypes.get();

      vm.seasonTypeId = seasonType.seasonTypeId;

      fetchData(vm.seasonId, vm.seasonTypeId);
    };

  }
);