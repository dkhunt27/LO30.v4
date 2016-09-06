'use strict';

angular.module('lo30NgApp')
  .controller('standingsController', function ($scope, criteriaService, apiService, screenSize, externalLibService, broadcastService) {

    var _ = externalLibService._;
    var sjv = externalLibService.sjv;

    var vm = this;

    var dtOptions = {
      //"dom": '<"html5buttons"B>lTfgitp',
      //"dom": "<'row'<'col-sm-4'l><'col-sm-4'f><'col-sm-4'<'html5buttons'B>>><'row'<'col-sm-12'rt>><'row'<'col-sm-5'i><'col-sm-7'p>>",
      //"buttons": [
      //  "colvis", "copyHtml5", "excelHtml5", { extend: 'pdfHtml5', orientation: 'landscape', pageSize: 'letter' }
      //],
      "paging": false,
      "searching": false,
      "order": [[0, "asc"]],
      "info": false,
      "scrollX": true,
      //"responsive": true,
      "columns": [
        { "data": "ranking", "title": "Rank", "className": "text-left" },
        {
          "data": "teamNameToDisplay",
          "title": "Team",
          "className": "text-left",
          "render": function (data, type, row) {
            var result = row.teamNameLong;
            if (screenSize.is('xs, sm')) {
              result = row.teamCode;
            } else if (screenSize.is('md')) {
              result = row.teamNameShort;
            }
            //return result;

            return '<a href="/#/r/profiles/teams/' + row.teamId + '/seasons/' + row.seasonId + '?tab=completed">' + data + '</a>';
          }
        },
        { "data": "games", "title": "Games", "className": "text-center" },
        { "data": "wins", "title": "Wins", "className": "text-center" },
        { "data": "losses", "title": "Losses", "className": "text-center" },
        { "data": "ties", "title": "Ties", "className": "text-center" },
        { "data": "points", "title": "Points", "className": "text-center" },
        { "data": "goalsFor", "title": "GF", "className": "text-center" },
        { "data": "goalsAgainst", "title": "GA", "className": "text-center" },
        { "data": "penaltyMinutes", "title": "PIM", "className": "text-center" },
        {
          "data": "winPercent",
          "title": "W%", 
          "className": "text-center",
          "render": function (data, type, row) {
            return Math.round(data * 100) + "%";
          }
        },
        { "data": "subs", "title": "Subs", "className": "text-center" },
        {
          "data": "teamId",
          "visible": false
        },
        {
          "data": "teamCode",
          "visible": false
        },
        {
          "data": "teamNameShort",
          "visible": false
        },
        {
          "data": "teamNameLong",
          "visible": false
        }
      ],
    }

    var fetchTeamStandings = function (seasonId, seasonTypeId) {

      vm.teamStandings = [];

      return apiService.teamStandings.listForSeasonIdSeasonTypeId(seasonId, seasonTypeId).then(function (fulfilled) {

        vm.teamStandings = buildTeamStandingsToDisplay(fulfilled);

        vm.teamStandings = parseTeamStandingsIntoDivisions(vm.teamStandings);

      }).finally(function () {

        vm.dtOptions = [];

        vm.teamStandings.forEach(function (data, index) {
          vm.dtOptions[index] = _.clone(dtOptions);
          vm.dtOptions[index].data = vm.teamStandings[index].teamStandings;
        });
      });
    };

    var parseTeamStandingsIntoDivisions = function (teamStandings) {
      var divisions = _.pluck(teamStandings, "divisionLongName");
      var uniqDivs = _.uniq(divisions);

      var teamStandingsDiv = [];

      uniqDivs.forEach(function (division) {

        var teamTemp = _.filter(teamStandings, function (item) { return item.divisionLongName === division; })

        teamStandingsDiv.push({ division: division, teamStandings: teamTemp });

      });

      return teamStandingsDiv;
    };

    var buildTeamStandingsToDisplay = function (teamStandings) {

      var teamStandingsToDisplay = teamStandings.map(function (item) {

        if (screenSize.is('xs, sm')) {

          item.teamNameToDisplay = item.teamCode;

        } else if (screenSize.is('md')) {

          item.teamNameToDisplay = item.teamNameShort;

        } else {

          item.teamNameToDisplay = item.teamNameLong;

        }

        return item;
      });

      return teamStandingsToDisplay;
    };

    var fetchData = function (seasonId, seasonTypeId) {

      return fetchTeamStandings(seasonId, seasonTypeId);

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

      setWatches();
    };
  });
