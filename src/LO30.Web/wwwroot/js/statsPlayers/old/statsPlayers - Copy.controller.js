'use strict';

angular.module('lo30NgApp')
  .controller('statsPlayersController', function ($scope, $state, $timeout, $q, $compile, criteriaService, apiService, screenSize, externalLibService, broadcastService, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {

    var _ = externalLibService._;
    var sjv = externalLibService.sjv;

    var vm = this;
    vm.dtInstance = {};

    var dtColumnIndex = -1;
    var dataDefer = $q.defer();

    vm.playerStatsFiltered = [];
    vm.playerStats = [];

    var initDatatable = function () {

      //define default option
      vm.dtOptions = DTOptionsBuilder.newOptions();

      //define colum
      vm.dtColumns = [
              DTColumnBuilder.newColumn('rank').withTitle('Rank'),
              DTColumnBuilder.newColumn('playerNameToDisplay').withTitle('Player'),
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
    }

    var renderDatatable = function () {

      //re define option
      vm.dtOptions = DTOptionsBuilder
        .fromFnPromise(function () {
          return dataDefer.promise;
        })
        .withOption('processing', true)
        .withOption('paging', true)
        .withOption('bFilter', false)
        .withOption('bInfo', true)
        .withOption('page-length', 10)
        .withOption('searching', false)
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
        .withDOM("<'row'<'col-sm-4'li><'col-sm-4'f><'col-sm-4'<'html5buttons'B>><'clearfix'>><'row'<'col-sm-12'rt>><'row'<'col-sm-3 text-left'i><'col-sm-9'<'pull-right'p>>>");

    };

    var fetchPlayerStats = function (seasonId, seasonTypeId, playerType, initial) {

      vm.dataLoaded = false;

      var playerStats = [];

      var apiServiceType = "playerStatTeams";

      if (playerType === "goalie") {

        apiServiceType = "goalieStatTeams";

      }

      apiService[apiServiceType].listForSeasonIdSeasonTypeId(seasonId, seasonTypeId).then(function (fulfilled) {

        playerStats = _.sortBy(fulfilled, function (item) { return item.points * -1; });

        playerStats = buildPlayerStatsToDisplay(playerStats);

      }).finally(function () {

        vm.playerStats = playerStats;

        //vm.playerStatsFiltered = _.clone(playerStats);

        vm.playerStatsFiltered = filter(vm.playerStats, vm.searchText);

        dataDefer.resolve(vm.playerStatsFiltered);

        vm.dataLoaded = true;
      });
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

    var fetchTeams = function (seasonId) {

      var teams = [];

      apiService.teams.listForSeasonId(seasonId).then(function (fulfilled) {

        vm.teams = buildTeamsToDisplay(fulfilled);

      }).finally(function () {

        // do nothing

      });
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

    $scope.filterByTeam = function (team) {
      dtColumnIndex = 10;

      var teamToSearchOn;
      if (screenSize.is('xs, sm')) {

        teamToSearchOn = team.teamCode;

      } else if (screenSize.is('md')) {

        teamToSearchOn = team.teamNameShort;

      } else {

        teamToSearchOn = team.teamNameShort;

      }

      var existingSearch = "team:" + vm.selectedTeam;

      var newSearch = "team:" + teamToSearchOn;

      if (vm.selectedTeam) {
        // if selected populated, that means there was a search before...remove that first 
        removeExistingSearchFromSearch(existingSearch);
      }

      if (vm.selectedTeam === teamToSearchOn) {
        // if same thing was clicked again...already been remove from search...just reset vars
        vm.selectedTeam = null;
      } else {
        // this is a new search, add to search
        prepSearchForNewSearch();
        addNewSearchToSearch(newSearch);
        vm.selectedTeam = teamToSearchOn;
      }

      vm.playerStatsFiltered = filter(vm.playerStats, vm.searchText);
    };

    $scope.filterBySub = function (sub) {
      var existingSearch = "sub:" + filterBySubMapper(vm.selectedSub);
      var newSearch = "sub:" + filterBySubMapper(sub);

      if (vm.selectedSub) {
        // if selected populated, that means there was a search before...remove that first 
        removeExistingSearchFromSearch(existingSearch);
      }

      if (vm.selectedSub === sub) {
        // if same thing was clicked again...already been remove from search...just reset vars
        vm.selectedSub = null;
      } else {
        // this is a new search, add to search
        prepSearchForNewSearch();
        addNewSearchToSearch(newSearch);
        vm.selectedSub = sub;
      }

      vm.playerStatsFiltered = filter(vm.playerStats, vm.searchText);
    };

    var filterBySubMapper = function (sub) {
      var subMapped;
      // map filter keys from columns to object
      switch (sub) {
        case "With":
          subMapped = "Y";
          break;
        case "Without":
          subMapped = "N";
          break;
        default:
          subMapped = sub;
      }

      return subMapped;
    };

    $scope.filterByLine = function (line) {
      var existingSearch = "line:" + vm.selectedLine;
      var newSearch = "line:" + line;

      if (vm.selectedLine) {
        // if selected populated, that means there was a search before...remove that first 
        removeExistingSearchFromSearch(existingSearch);
      }

      if (vm.selectedLine === line) {
        // if same thing was clicked again...already been remove from search...just reset vars
        vm.selectedLine = null;
      } else {
        // this is a new search, add to search
        prepSearchForNewSearch();
        addNewSearchToSearch(newSearch);
        vm.selectedLine = line;
      }

      vm.playerStatsFiltered = filter(vm.playerStats, vm.searchText);
    };

    $scope.filterByPosition = function (position) {
      var existingSearch = "pos:" + vm.selectedPosition;
      var newSearch = "pos:" + position;

      if (vm.selectedPosition) {
        // if selected populated, that means there was a search before...remove that first 
        removeExistingSearchFromSearch(existingSearch);
      }

      if (vm.selectedPosition === position) {
        // if same thing was clicked again...already been remove from search...just reset vars
        vm.selectedPosition = null;
      } else {
        // this is a new search, add to search
        prepSearchForNewSearch();
        addNewSearchToSearch(newSearch);
        vm.selectedPosition = position;
      }

      vm.playerStatsFiltered = filter(vm.playerStats, vm.searchText);
    };

    var addNewSearchToSearch = function (newSearch) {
      vm.searchText = vm.searchText + newSearch;
    };

    var removeExistingSearchFromSearch = function (existingSearch) {
      vm.searchText = vm.searchText.replace(", " + existingSearch, "");
      vm.searchText = vm.searchText.replace(existingSearch + ", ", "");
      vm.searchText = vm.searchText.replace(existingSearch, "");
    };

    var prepSearchForNewSearch = function () {
      if (vm.searchText) {
        vm.searchText = vm.searchText + ", ";
      } else {
        vm.searchText = "";
      }
    };

    var processIntoFilters = function (filterOn) {
      var filters = [];

      var filterOnFilters = filterOn.split(',');

      angular.forEach(filterOnFilters, function (filterOnFilter) {
        var filterOnFilterParts = filterOnFilter.split(':');
        if (filterOnFilterParts.length === 0 || !filterOnFilterParts[1]) {
          // this is text only filter
          filters.push({ key: "TEXTONLY", value: filterOnFilterParts })
        } else {

          var filterOnKey = filterOnFilterParts[0].replace(/(^\s+|\s+$)/g, '');  // remove any space that would be with comma
          var filterOnValue = filterOnFilterParts[1].toLowerCase();

          var filterKeyMapped;
          // map filter keys from columns to object
          switch (filterOnKey.toLowerCase()) {
            case "rank":
              filterKeyMapped = "ranking";
              break;
            case "team":
              if (screenSize.is('xs, sm')) {
                filterKeyMapped = "teamCode";
              } else {
                filterKeyMapped = "teamNameShort";
              }
              break;
            case "player":
              filterKeyMapped = "player";
              break;
            case "pos":
            case "position":
              filterKeyMapped = "position";
              break;
            case "line":
              filterKeyMapped = "line";
              break;
            case "sub":
              filterKeyMapped = "sub";
              break;
            default:
          }

          filters.push({ key: filterKeyMapped, value: filterOnValue })
        }
      });

      return filters;
    };

    var filter = function (items, filterOn) {
      if (!filterOn) {
        return items;
      } else {
        var filters = processIntoFilters(filterOn);
        var filtered = [];
        angular.forEach(items, function (item) {
          var matchedItem = []

          angular.forEach(filters, function (filter) {
            if (filter.key === "TEXTONLY") {
              if (JSON.stringify(item).toLowerCase().indexOf(filter.value) !== -1) {
                matchedItem.push(item);
              }
            } else {
              var propValue = item[filter.key];
              if (propValue) {

                if (typeof propValue !== "string") {
                  propValue = JSON.stringify(propValue);
                }

                if (propValue.toLowerCase().indexOf(filter.value) !== -1) {
                  matchedItem.push(item);
                }
              }
            }
          });

          // now if the matchedItem length === filters length...then it matched on all the filters, so keep it
          if (matchedItem.length === filters.length) {
            filtered.push(item);
          }
        });
      }
      return filtered;
    };

    var fetchData = function (seasonId, seasonTypeId, playerType, initial) {

      fetchTeams(seasonId);

      fetchPlayerStats(seasonId, seasonTypeId, playerType, initial);
    };

    var setWatches = function () {

      $scope.$on(broadcastService.events().seasonSet, function () {

        var season = criteriaService.seasons.get();

        vm.seasonId = season.seasonId;

        fetchData(vm.seasonId, vm.seasonTypeId, vm.playerType, false);

      });

      $scope.$on(broadcastService.events().seasonTypeSet, function () {

        var seasonType = criteriaService.seasonTypes.get();

        vm.seasonTypeId = seasonType.seasonTypeId;

        fetchData(vm.seasonId, vm.seasonTypeId, vm.playerType, false);

      });

      $scope.$watch(function () { return $state.params.playerType; }, function (value) {
        vm.playerType = value;
      });

      $scope.$watch(function () { return vm.dtInstance; }, function (val, oldVal) {
        if (val !== oldVal) {

          vm.dtInstance = val;

          // Setup - add a text input to each footer cell
          /*var id = '#' + val.id;

          $(id + ' tfoot th').each(function () {
            var title = $(this).text();
            $(this).html('<input id="dtFooterFilter' + $(this).index() + '" type="text"" placeholder="Search ' + title + '" />');
          });

          // DataTable
          var table = $(id).DataTable();

          // Apply the search
          table.columns().eq(0).each(function (colIdx) {
            var that = this;
            var id = '#dtFooterFilter' + colIdx;
            $(id).on('keyup change', function () {

            //$('input', this.footer()).on('keyup change', function () {
              if (that.search() !== this.value) {
                that
                    .search(this.value)
                    .draw();
              }
            });
          });*/

          /*
          $(id + ' tfoot th').each(function() {
            var title = $(id + ' thead th').eq($(this).index()).text();
            $(this).html('<input id="dtFooterFilter' + $(this).index() + '" type="text" placeholder="Search ' + title + '" />');
          });

          var table = val.DataTable;
          // Apply the search
          table.columns().eq(0).each(function (colIdx) {
            var id = '#dtFooterFilter' + colIdx;
            $(id).on('keyup change', function () {
              table
                .column(colIdx)
                .search(this.value)
                .draw();
            });
          });*/
        }
      });
    };

    vm.$onInit = function () {

      vm.dataLoaded = false;

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

      var season = criteriaService.seasons.get();

      vm.seasonId = season.seasonId;

      var seasonType = criteriaService.seasonTypes.get();

      vm.seasonTypeId = seasonType.seasonTypeId;

      vm.playerType = $state.params.playerType;

      $scope.filterBySub("Without");

      fetchData(vm.seasonId, vm.seasonTypeId, vm.playerType, true);

      initDatatable();

      $timeout(function () {
        setWatches();
        renderDatatable();
      }, 100);
    };
  });
