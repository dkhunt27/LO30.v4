'use strict';

angular.module('lo30NgApp')
  .controller('statsPlayersController', function ($scope, $state, $timeout, $q, $compile, criteriaService, apiService, screenSize, externalLibService, broadcastService, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {

    var _ = externalLibService._;
    var sjv = externalLibService.sjv;

    var vm = this;
    var deferred = {};
    var dtPlayerStats;

    // the index of the searchable column based on playerType
    var colIndex = {
      team: {
        skater: 10,
        goalie: 8
      },
      sub: {
        skater: 13,
        goalie: 9
      },
      position: {
        skater: 11,
        goalie: -1
      },
      line: {
        skater: 12,
        goalie: -1
      }
    }

    var initDatatable = function (playerType) {

      //define default option
      vm.dtOptions = DTOptionsBuilder.newOptions();

      if (playerType === "skater") {
        vm.dtColumns = [
          DTColumnBuilder.newColumn('rank').withTitle('Rank'),
          DTColumnBuilder.newColumn('playerNameToDisplay').withTitle('Player')
              .renderWith(function (data, type, row, meta) {
                return '<a href="/#/r/profiles/players/' + row.playerId + '/playertypes/skater?tab=season">' + data + '</a>';
              }),
          DTColumnBuilder.newColumn('games').withTitle('Games'),
          DTColumnBuilder.newColumn('goals').withTitle('Goals'),
          DTColumnBuilder.newColumn('assists').withTitle('Assists'),
          DTColumnBuilder.newColumn('points').withTitle('Points'),
          DTColumnBuilder.newColumn('penaltyMinutes').withTitle('PIM'),
          DTColumnBuilder.newColumn('powerPlayGoals').withTitle('PPG'),
          DTColumnBuilder.newColumn('shortHandedGoals').withTitle('SHG'),
          DTColumnBuilder.newColumn('gameWinningGoals').withTitle('GWG'),
          DTColumnBuilder.newColumn('teamNameToDisplay').withTitle('Team'),
          DTColumnBuilder.newColumn('position').withTitle('Position'),
          DTColumnBuilder.newColumn('line').withTitle('Line'),
          DTColumnBuilder.newColumn('sub').withTitle('Sub')
        ];
      } else {
        vm.dtColumns = [
          DTColumnBuilder.newColumn('rank').withTitle('Rank'),
          DTColumnBuilder.newColumn('playerNameToDisplay').withTitle('Player')
              .renderWith(function (data, type, row, meta) {
                return '<a href="/#/r/profiles/players/' + row.playerId + '/playertypes/goalie?tab=season">' + data + '</a>';
              }),
          DTColumnBuilder.newColumn('games').withTitle('Games'),
          DTColumnBuilder.newColumn('wins').withTitle('Wins'),
          DTColumnBuilder.newColumn('winPercent').withTitle('W%')
                .renderWith(function (data, type, row, meta) {
                  return Math.round(data * 100) + "%";
                }),
          DTColumnBuilder.newColumn('goalsAgainst').withTitle('GA'),
          DTColumnBuilder.newColumn('goalsAgainstAverage').withTitle('GAA')
              .renderWith(function (data, type, row, meta) {
                return data.toFixed(2);
              }),
          DTColumnBuilder.newColumn('shutouts').withTitle('Shutouts'),
          DTColumnBuilder.newColumn('teamNameToDisplay').withTitle('Team'),
          DTColumnBuilder.newColumn('sub').withTitle('Sub')
        ];
      }

      vm.dtInstance = {};
    }

    var renderDatatable = function () {

      //re define option
      vm.dtOptions = DTOptionsBuilder
        .fromFnPromise(function () {
          return deferred.promise;
        })
        .withOption('processing', true)
        .withOption('paging', true)
        .withOption('bFilter', false)
        .withOption('bInfo', true)
        .withOption('page-length', 10)
        .withOption('responsive', true)
        .withOption('searching', true)
        .withOption('order', [[5, "desc"]])
        .withOption('scrollX', true)
        .withPaginationType('full_numbers')
        .withDisplayLength(10)
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
        .withBootstrap()
        .withButtons(["colvis", "copyHtml5", "excelHtml5", { extend: 'pdfHtml5', orientation: 'landscape', pageSize: 'letter' }])
        .withDOM("<'row'<'col-sm-4'l><'col-sm-4 text-center'i><'col-sm-4'<'html5buttons'B>>><'row'<'col-sm-12'rt>><'row'<'col-sm-12'p>>");

    };

    var buildPlayerStatsToDisplay = function (playerStats) {

      var playerStatsToDisplay = playerStats.map(function (item, index) {

        item.sub = item.sub ? "Y" : "N";

        item.rank = index + 1;

        if (screenSize.is('xs, sm')) {

          item.teamNameToDisplay = item.teamCode;
          item.playerNameToDisplay = item.playerFirstName + ' ' + item.playerLastName;

          if (item.playerSuffix) {
            item.playerNameToDisplay = item.playerNameToDisplay + ' ' + item.playerSuffix;
          }

        } else if (screenSize.is('md')) {

          item.teamNameToDisplay = item.teamNameShort;
          item.playerNameToDisplay = item.playerFirstName + ' ' + item.playerLastName;

          if (item.playerSuffix) {
            item.playerNameToDisplay = item.playerNameToDisplay + ' ' + item.playerSuffix;
          }

        } else {

          item.teamNameToDisplay = item.teamNameShort;
          item.playerNameToDisplay = item.playerFirstName + ' ' + item.playerLastName;

          if (item.playerSuffix) {
            item.playerNameToDisplay = item.playerNameToDisplay + ' ' + item.playerSuffix;
          }

        }

        return item;
      });

      return playerStatsToDisplay;
    };

    var buildTeamsToDisplay = function (teams) {

      var teamsToDisplay = teams.map(function (item, index) {

        item.rank = index + 1;

        if (screenSize.is('xs, sm')) {

          item.teamNameToDisplay = item.teamCode;

        } else if (screenSize.is('md')) {

          item.teamNameToDisplay = item.teamNameShort;

        } else {

          item.teamNameToDisplay = item.teamNameShort;

        }

        return item;
      });

      return teamsToDisplay;
    };

    var fetchPlayerStats = function (seasonId, seasonTypeId, playerType) {

      vm.dataLoaded = false;

      var playerStats = [];

      var apiServiceType = "playerStatTeams";

      if (playerType === "goalie") {

        apiServiceType = "goalieStatTeams";

      }

      apiService[apiServiceType].listForSeasonIdSeasonTypeId(seasonId, seasonTypeId).then(function (fulfilled) {

        playerStats = buildPlayerStatsToDisplay(fulfilled);

      }).finally(function () {

        deferred.resolve(playerStats);

        vm.dataLoaded = true;
      });
    };

    var fetchTeams = function (seasonId) {

      var teams = [];

      apiService.teams.listForSeasonId(seasonId).then(function (fulfilled) {

        vm.teams = buildTeamsToDisplay(fulfilled);

      }).finally(function () {

        // do nothing

      });
    };

    var fetchData = function (seasonId, seasonTypeId, playerType) {

      fetchTeams(seasonId);

      fetchPlayerStats(seasonId, seasonTypeId, playerType);
    };

    $scope.removeSearch = function () {
      $scope.searchText = null;
      dtPlayerStats
       .search("")
       .draw();
    };

    $scope.performSearch = function () {

      var searchOn = $scope.searchText ? $scope.searchText : "";

      dtPlayerStats
       .search(searchOn)
       .draw();
    };

    var performColumnSearch = function (colIndex, value) {
      dtPlayerStats
       .columns(colIndex)
       .search(value)
       .draw();
    };

    var removeColumnSearch = function (colIndex) {
      dtPlayerStats
       .columns(colIndex)
       .search("")
       .draw();
    };

    var searchOn = function (colIndex, searchToProcess, searchToSave) {

      if (searchToSave) {
        // if searchToSave, that means there was a filter before...remove that first 
        removeColumnSearch(colIndex);
      }

      if (searchToProcess === searchToSave) {
        // if same thing was clicked again...already been remove from search...just reset vars
        searchToSave = null;
      } else {
        // this is a new search, add to search
        searchToSave = searchToProcess;

        performColumnSearch(colIndex, searchToProcess);
      }

      return searchToSave;
    }

    $scope.filterByTeam = function (team) {
      var teamColIndex = 10;

      var teamToSearchOn;
      if (screenSize.is('xs, sm')) {

        teamToSearchOn = team.teamCode;

      } else if (screenSize.is('md')) {

        teamToSearchOn = team.teamNameShort;

      } else {

        teamToSearchOn = team.teamNameShort;

      }

      var searchOnColIndex = colIndex.team[vm.playerType];

      vm.selectedTeam = searchOn(searchOnColIndex, teamToSearchOn, vm.selectedTeam);

    };

    var subMapper = function (sub) {
      var subMapped;

      if (sub === "With") {
        subMapped = "Y";
      } else if (sub === "Without") {
        subMapped = "N";
      } else if (sub === "Y") {
        subMapped = "With";
      } else if (sub === "N") {
        subMapped = "Without";
      } else {
        subMapped = null;
      }

      return subMapped;
    }

    $scope.filterBySub = function (sub) {

      var subToSearchOn = subMapper(sub);

      var selectedSubToSearchOn = subMapper(vm.selectedSub);

      var searchOnColIndex = colIndex.sub[vm.playerType];

      selectedSubToSearchOn = searchOn(searchOnColIndex, subToSearchOn, selectedSubToSearchOn);

      vm.selectedSub = subMapper(selectedSubToSearchOn);
    };

    $scope.filterByLine = function (line) {

      var searchOnColIndex = colIndex.line[vm.playerType];

      vm.selectedLine = searchOn(searchOnColIndex, line, vm.selectedLine);
    };

    $scope.filterByPosition = function (position) {

      var searchOnColIndex = colIndex.position[vm.playerType];

      vm.selectedPosition = searchOn(searchOnColIndex, position, vm.selectedPosition);
    };

    var setWatches = function () {

      $scope.$on(broadcastService.events().seasonSet, function () {

        var season = criteriaService.seasons.get();

        vm.seasonId = season.seasonId;

        fetchData(vm.seasonId, vm.seasonTypeId, vm.playerType);

      });

      $scope.$on(broadcastService.events().seasonTypeSet, function () {

        var seasonType = criteriaService.seasonTypes.get();

        vm.seasonTypeId = seasonType.seasonTypeId;

        fetchData(vm.seasonId, vm.seasonTypeId, vm.playerType);

      });

      $scope.$watch(function () { return $state.params.playerType; }, function (value) {
        vm.playerType = value;
      });

      $scope.$watch('searchText', function (value, oldValue) {

        if (value !== oldValue) {
          $scope.performSearch(value);
        }
      });

      $scope.$watch(function () { return vm.dtInstance; }, function (val, oldVal) {
        if (val !== oldVal && val.DataTable) {

          dtPlayerStats = val.DataTable;

          dtPlayerStats.on('order.dt search.dt', function () {
            dtPlayerStats.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
              cell.innerHTML = i + 1;
            });
          }).draw();

        }
      });

      //$scope.$watch(function () { return vm.dtInstance; }, function (val, oldVal) {
      //  if (val !== oldVal) {

      //    vm.dtInstance = val;

      //    // Setup - add a text input to each footer cell
      //    /*var id = '#' + val.id;

      //    $(id + ' tfoot th').each(function () {
      //      var title = $(this).text();
      //      $(this).html('<input id="dtFooterFilter' + $(this).index() + '" type="text"" placeholder="Search ' + title + '" />');
      //    });

      //    // DataTable
      //    var table = $(id).DataTable();

      //    // Apply the search
      //    table.columns().eq(0).each(function (colIdx) {
      //      var that = this;
      //      var id = '#dtFooterFilter' + colIdx;
      //      $(id).on('keyup change', function () {

      //      //$('input', this.footer()).on('keyup change', function () {
      //        if (that.search() !== this.value) {
      //          that
      //              .search(this.value)
      //              .draw();
      //        }
      //      });
      //    });*/

      //    /*
      //    $(id + ' tfoot th').each(function() {
      //      var title = $(id + ' thead th').eq($(this).index()).text();
      //      $(this).html('<input id="dtFooterFilter' + $(this).index() + '" type="text" placeholder="Search ' + title + '" />');
      //    });

      //    var table = val.DataTable;
      //    // Apply the search
      //    table.columns().eq(0).each(function (colIdx) {
      //      var id = '#dtFooterFilter' + colIdx;
      //      $(id).on('keyup change', function () {
      //        table
      //          .column(colIdx)
      //          .search(this.value)
      //          .draw();
      //      });
      //    });*/
      //  }
      //});
    };

    vm.$onInit = function () {

      vm.dataLoaded = false;

      deferred = $q.defer();

      vm.positions = [
        "F",
        "D",
        "G"
      ];

      vm.subs = [
        "With",
        "Without",
      ];

      vm.lines = [
        "1",
        "2",
        "3",
      ];

      if (screenSize.is('xs, sm')) {

        vm.screenSizeIsMobile = true;

      } else if (screenSize.is('md')) {

        vm.screenSizeIsMobile = false;

      }

      var season = criteriaService.seasons.get();

      vm.seasonId = season.seasonId;

      var seasonType = criteriaService.seasonTypes.get();

      vm.seasonTypeId = seasonType.seasonTypeId;

      vm.playerType = $state.params.playerType;

      //$scope.filterBySub("Without");

      initDatatable(vm.playerType);

      $timeout(function () {
        setWatches();
        renderDatatable(vm.playerType);
        fetchData(vm.seasonId, vm.seasonTypeId, vm.playerType);
      }, 100);
    };
  });
