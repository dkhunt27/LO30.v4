"use strict";

angular.module('lo30NgApp')
  .controller('profilesTeamsController', function ($log, $scope, $state, $timeout, $q, $compile, constScheduleTeamFeedBaseUrl, criteriaService, apiService, screenSize, externalLibService, broadcastService, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {

    var _ = externalLibService._;
    var sjv = externalLibService.sjv;

    var vm = this;
    var deferred = {};
    var tabStates = {
      completed: 0,
      upcoming: 1,
      schedule: 2
    };

    var tabLoaded = [false, false, false] // must match tabStates length

    var classBasedOnOoutcome = function (data) {
      var className = "info";

      if (data === 'W' || data === 'W*') {
        className = "success";
      } else if (data === 'T' || data === 'T*') {
        className = "warning";
      } else if (data === 'L' || data === 'L*') {
        className = "danger";
      }

      return className;
    }

    var initDatatable = function () {

      //define default option
      vm.dtOptions = {
        teamStandings: DTOptionsBuilder.newOptions(),
        gamesCompleted: DTOptionsBuilder.newOptions(),
        gamesUpcoming: DTOptionsBuilder.newOptions()
      }

      vm.dtColumns = {
        teamStandings: [
          DTColumnBuilder.newColumn('ranking').withTitle('Rank'),
          DTColumnBuilder.newColumn('teamNameToDisplay').withTitle('Team'),
          DTColumnBuilder.newColumn('games').withTitle('Games'),
          DTColumnBuilder.newColumn('wins').withTitle('Wins'),
          DTColumnBuilder.newColumn('losses').withTitle('Losses'),
          DTColumnBuilder.newColumn('ties').withTitle('Ties'),
          DTColumnBuilder.newColumn('points').withTitle('Points'),
          DTColumnBuilder.newColumn('goalsFor').withTitle('GF'),
          DTColumnBuilder.newColumn('goalsAgainst').withTitle('GA'),
          DTColumnBuilder.newColumn('penaltyMinutes').withTitle('PIM'),
          DTColumnBuilder.newColumn('winPercent').withTitle('W%')
            .renderWith(function (data, type, row, meta) {
              return Math.round(data * 100) + "%";
            }),
          DTColumnBuilder.newColumn('subs').withTitle('Subs')
        ],
        gamesCompleted: [
          DTColumnBuilder.newColumn('gameId').withTitle('Game')
            .renderWith(function (data, type, row, meta) {
              return '<a href="#">' + data + '</a>';
            }),
          DTColumnBuilder.newColumn('gameDateTime').withTitle('Date')
            .renderWith(function (data, type, row, meta) {
              return moment(data).format('MMM Do YY h:mm a');
            }),
          DTColumnBuilder.newColumn('outcomeToDisplay').withTitle('Outcome')                  
            .renderWith(function (data, type, row, meta) {
              var className = classBasedOnOoutcome(data);
              if (className === "success") {
                return '<b class="text-' + className + '">' + data + '</b>';
              } else {
                return '<span class="text-' + className + '">' + data + '</span>';
              }
            }),
          DTColumnBuilder.newColumn('awayTeamToDisplay').withTitle('Away').notSortable()
            .renderWith(function (data, type, row, meta) {
              var className = "default";
              var boldOrSpan = "span";
              if (row.teamIdAway === vm.teamId) {
                boldOrSpan = "b"
                className = classBasedOnOoutcome(row.outcomeAway);
              }
              return '<' + boldOrSpan + ' class="label label-' + className + '">' + row.goalsForAway + '</' + boldOrSpan + '>&nbsp;&nbsp;<' + boldOrSpan + ' class="text-' + className + '">' + data + '</' + boldOrSpan + '>';
            }),
          DTColumnBuilder.newColumn('homeTeamToDisplay').withTitle('').notSortable()
            .renderWith(function (data, type, row, meta) {
              return "@";
            }),
          DTColumnBuilder.newColumn('homeTeamToDisplay').withTitle('Home').notSortable()
            .renderWith(function (data, type, row, meta) {
              var className = "default";
              var boldOrSpan = "span";
              if (row.teamIdHome === vm.teamId) {
                boldOrSpan = "b"
                className = classBasedOnOoutcome(row.outcomeHome);
              }
              return '<' + boldOrSpan + ' class="label label-' + className + '">' + row.goalsForHome + '</' + boldOrSpan + '>&nbsp;&nbsp;<' + boldOrSpan + ' class="text-' + className + '">' + data + '</' + boldOrSpan + '>';
            }),
        ],
        gamesUpcoming: [
              DTColumnBuilder.newColumn('gameId').withTitle('Game')
                .renderWith(function (data, type, row, meta) {
                  return '<a href="#">' + data + '</a>';
                }),
              DTColumnBuilder.newColumn('gameDateTime').withTitle('Date'),
              DTColumnBuilder.newColumn('awayTeamToDisplay').withTitle('Away').notSortable()
                  .renderWith(function (data, type, row, meta) {
                    if (row.teamIdAway === vm.teamId) {
                      return "<b>" + data + "</b>";
                    } else {
                      return data;
                    }
                  }),
              DTColumnBuilder.newColumn('homeTeamToDisplay').withTitle('').notSortable()
                  .renderWith(function (data, type, row, meta) {
                    return "@";
                  }),
              DTColumnBuilder.newColumn('homeTeamToDisplay').withTitle('Home').notSortable()
                  .renderWith(function (data, type, row, meta) {
                    if (row.teamIdHome === vm.teamId) {
                      return "<b>" + data + "</b>";
                    } else {
                      return data;
                    }
                  })
        ]
      };

      vm.dtInstance = {
        teamStandings: {},
        gamesCompleted: {},
        gamesUpcoming: {}
      };
    }

    var renderDatatable = function () {

      var teamStandings = DTOptionsBuilder
          .fromFnPromise(function () {
            return deferred.teamStandings.promise;
          })
          .withOption('processing', false)
          .withOption('paging', false)
          .withOption('bFilter', false)
          .withOption('bInfo', false)
          .withOption('searching', false)
          .withOption('scrollX', true)
          .withBootstrap();

      var gamesCompleted = DTOptionsBuilder
          .fromFnPromise(function () {
            return deferred.gamesCompleted.promise;
          })
          .withOption('createdRow', function (row, data, dataIndex) {
            if (data.outcomeToDisplay === "W" || data.outcomeToDisplay === "W*") {
              row.className = "info";
            } else if (data.outcomeToDisplay === "T" || data.outcomeToDisplay === "T*") {
              row.className = "warning";
            } else if (data.outcomeToDisplay === "L" || data.outcomeToDisplay === "L*") {
              row.className = "danger";
            } else {
              row.className = "info";
            }
            $compile(angular.element(row).contents())($scope);
          })
          .withOption('processing', false)
          .withOption('paging', false)
          .withOption('bFilter', false)
          .withOption('bInfo', false)
          //.withOption('page-length', false)
          .withOption('searching', false)
          //.withOption('order', [[5, "desc"]])
          .withOption('scrollX', true)
          //.withPaginationType('full_numbers')
          //.withDisplayLength(10)
          /*.withOption('createdRow', function (row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
          })
          .withOption('headerCallback', function (header) {
            if (!$scope.headerCompiled) {
              // Use this headerCompiled field to only compile header once
              $scope.headerCompiled = true;
              $compile(angular.element(header).contents())($scope);
            }
          })*/
          .withBootstrap();
      //.withButtons(["colvis", "copyHtml5", "excelHtml5", { extend: 'pdfHtml5', orientation: 'landscape', pageSize: 'letter' }])
      // .withDOM("<'row'<'col-sm-4'li><'col-sm-4'f><'col-sm-4'<'html5buttons'B>><'clearfix'>><'row'<'col-sm-12'rt>><'row'<'col-sm-3 text-left'i><'col-sm-9'<'pull-right'p>>>");

      var gamesUpcoming = DTOptionsBuilder
          .fromFnPromise(function () {
            return deferred.gamesUpcoming.promise;
          })
          .withOption('processing', false)
          .withOption('paging', false)
          .withOption('bFilter', false)
          .withOption('bInfo', false)
          //.withOption('page-length', false)
          .withOption('searching', false)
          //.withOption('order', [[5, "desc"]])
          .withOption('scrollX', true)
          //.withPaginationType('full_numbers')
          //.withDisplayLength(10)
          /*.withOption('createdRow', function (row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
          })
          .withOption('headerCallback', function (header) {
            if (!$scope.headerCompiled) {
              // Use this headerCompiled field to only compile header once
              $scope.headerCompiled = true;
              $compile(angular.element(header).contents())($scope);
            }
          })*/
          .withBootstrap();
      //.withButtons(["colvis", "copyHtml5", "excelHtml5", { extend: 'pdfHtml5', orientation: 'landscape', pageSize: 'letter' }])
      // .withDOM("<'row'<'col-sm-4'li><'col-sm-4'f><'col-sm-4'<'html5buttons'B>><'clearfix'>><'row'<'col-sm-12'rt>><'row'<'col-sm-3 text-left'i><'col-sm-9'<'pull-right'p>>>");

      //re define option
      vm.dtOptions = {
        teamStandings: teamStandings,
        gamesCompleted: gamesCompleted,
        gamesUpcoming: gamesUpcoming
      };
    }

    var buildTeamStandingsToDisplay = function (teamStandings) {

      var teamStandingsToDisplay = teamStandings.map(function (item) {

        $scope.selectedTeamName = item.teamNameLong;

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

    var buildTeamFeed = function (teamStandings) {

      var team = teamStandings[0]; // all the team info should be the same, so just take the first one

      var seasonId = team.seasonId;
      var teamId = team.teamId;
      var scheduleTeamName = team.teamNameLong.replace(/ /g, "").replace(/\//g, "").replace(/-/g, "").replace(/\./g, "");
      var scheduleSeasonName = team.seasonName.replace(/ /g, "");

      var teamFeed = {
        teamCode: team.teamCode,
        teamNameLong: team.teamNameLong,
        teamNameShort: team.teamNameShort,
        teamFeedUrl: constScheduleTeamFeedBaseUrl + "/Schedule/TeamFeed/Seasons/" + seasonId + "/Teams/" + teamId + "/LO30Schedule-" + scheduleTeamName + "-" + scheduleSeasonName
      };

      return teamFeed;
    };

    var buildGamesToDisplay = function (games, teamId) {

      var gamesToDisplay = games.map(function (item, index) {

        item.outcomeToDisplay = item.outcomeAway;

        if (item.teamIdHome === teamId) {
          item.outcomeToDisplay = item.outcomeHome;
        }

        if (item.overridenAway) {
          item.outcomeToDisplay = item.outcomeToDisplay + "*";
        }

        if (screenSize.is('xs, sm')) {

          item.awayTeamToDisplay = item.teamCodeAway;

          item.homeTeamToDisplay = item.teamCodeHome;

        } else if (screenSize.is('md')) {

          item.awayTeamToDisplay = item.teamNameShortAway;

          item.homeTeamToDisplay = item.teamNameShortHome;

        } else {

          item.awayTeamToDisplay = item.teamNameLongAway;

          item.homeTeamToDisplay = item.teamNameLongHome;

        }

        return item;
      });

      return gamesToDisplay;

    };

    var fetchTeamStandings = function (seasonId, teamId) {

      vm.teamStandingsDataLoaded = false;

      var teamStandings = [];

      var teamFeed = [];

      apiService.teamStandings.listForSeasonIdTeamId(seasonId, teamId).then(function (fulfilled) {

        teamStandings = buildTeamStandingsToDisplay(fulfilled);

        teamFeed = buildTeamFeed(teamStandings);

      }).finally(function () {

        deferred.teamStandings.resolve(teamStandings);

        vm.teamFeed = teamFeed; //not a datatable, so no need for deferred

        vm.teamStandingsDataLoaded = true;

      });
    };

    var fetchGames = function (seasonId, teamId) {

      vm.gamesDataLoaded = false;

      var games = [];

      apiService.games.listForSeasonIdTeamId(seasonId, teamId).then(function (fulfilled) {

        games = buildGamesToDisplay(fulfilled, teamId);

      }).finally(function () {

        var gamesCompleted = _.filter(games, function (item) { return item.outcomeHome !== null; });

        gamesCompleted = _.sortBy(gamesCompleted, function (item) { return item.gameId * -1; });

        deferred.gamesCompleted.resolve(gamesCompleted);

        $log.debug("gamesCompleted", gamesCompleted);

        var gamesUpcoming = _.filter(games, function (item) { return item.outcomeHome === null; });

        gamesUpcoming = _.sortBy(gamesUpcoming, function (item) { return item.gameId; });

        deferred.gamesUpcoming.resolve(gamesUpcoming);

        $log.debug("gamesUpcoming", gamesUpcoming);

        vm.gamesDataLoaded = true;

      });
    };

    var fetchData = function (seasonId, teamId) {

      fetchTeamStandings(seasonId, teamId);

      fetchGames(seasonId, teamId);
    };

    var setWatches = function () {
      $scope.$on(broadcastService.events().seasonSet, function () {

        var season = criteriaService.seasons.get();

        vm.seasonId = season.seasonId;

        fetchData(vm.seasonId, vm.teamId);

      });

      $scope.$watch('tabActiveIndex', function (newVal, oldVal) {

        if (newVal > -1 && newVal !== oldVal) {

          if (!tabLoaded[newVal]) {
            // only fetch the data once per tab
            fetchData(vm.seasonId, vm.teamId);
            tabLoaded[newVal] = true;
          }

        }
      });

      $scope.$watch(function () { return $state.params.teamId; }, function (value) {
        vm.teamId = parseInt(value, 10);
      });
    };

    vm.$onInit = function () {

      vm.teamStandingsDataLoaded = false;
      vm.gamesDataLoaded = false;

      $scope.tabActiveIndex = -1;

      deferred = {
        teamStandings: $q.defer(),
        gamesCompleted: $q.defer(),
        gamesUpcoming: $q.defer(),
        teamFeed: $q.defer()
      }

      var season = criteriaService.seasons.get();

      vm.seasonId = season.seasonId;

      vm.teamId = parseInt($state.params.teamId, 10);

      // use timeout to let the uib-tab initial the active states
      $timeout(function () {
        // map to active tab index

        if ($state.params.tab) {
          $scope.tabActiveIndex = tabStates[$state.params.tab];
        } else {
          // set default tab, after watches so correct data events fire
          $scope.tabActiveIndex = tabStates.upcoming;  // set default tab
        }
      }, 200);

      initDatatable();

      $timeout(function () {
        setWatches();
        renderDatatable();
      }, 100);  //needs to occur before the timeouts for the activetabs
    };
  }
);