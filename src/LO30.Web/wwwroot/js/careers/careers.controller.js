'use strict';

angular.module('lo30NgApp')
  .controller('careersController', function ($log, $scope, $state, $timeout, $q, $compile, criteriaService, apiService, screenSize, externalLibService, broadcastService, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {

    var _ = externalLibService._;
    var sjv = externalLibService.sjv;

    var vm = this;
    var deferred = {};
    var dtCareers;

    var initDatatable = function (playerType) {

      //define default option
      vm.dtOptions = DTOptionsBuilder.newOptions();

      if (playerType === "skater") {
        vm.dtColumns = [
          DTColumnBuilder.newColumn('rank').withTitle('Rank'),
          DTColumnBuilder.newColumn('playerNameToDisplay').withTitle('Player')
              .renderWith(function (data, type, row, meta) {
                return '<a href="/#/r/profiles/players/' + row.playerId + '/playertypes/skater?tab=career">' + data + '</a>';
              }),
          DTColumnBuilder.newColumn('seasons').withTitle('Seasons'),
          DTColumnBuilder.newColumn('games').withTitle('Games'),
          DTColumnBuilder.newColumn('goals').withTitle('Goals'),
          DTColumnBuilder.newColumn('assists').withTitle('Assists'),
          DTColumnBuilder.newColumn('points').withTitle('Points'),
          DTColumnBuilder.newColumn('penaltyMinutes').withTitle('PIM'),
          DTColumnBuilder.newColumn('powerPlayGoals').withTitle('PPG'),
          DTColumnBuilder.newColumn('shortHandedGoals').withTitle('SHG'),
          DTColumnBuilder.newColumn('gameWinningGoals').withTitle('GWG')
        ];
      } else {
        vm.dtColumns = [
            DTColumnBuilder.newColumn('rank').withTitle('Rank'),
            DTColumnBuilder.newColumn('playerNameToDisplay').withTitle('Player')
                .renderWith(function (data, type, row, meta) {
                  return '<a href="/#/r/profiles/players/' + row.playerId + '/playertypes/goalie?tab=career">' + data + '</a>';
                }),
            DTColumnBuilder.newColumn('seasons').withTitle('Seasons'),
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
            DTColumnBuilder.newColumn('shutouts').withTitle('Shutouts')
        ];
      }

      vm.dtInstance = {};
    }

    var renderDatatable = function (playerType) {

      var colSort = 6;

      if (playerType === "goalie") {
        colSort = 4
      }

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
        .withOption('order', [[colSort, "desc"]])
        .withOption('scrollX', true)
        .withPaginationType('full_numbers')
        .withDisplayLength(10)
        .withBootstrap()
        .withButtons(["colvis", "copyHtml5", "excelHtml5", { extend: 'pdfHtml5', orientation: 'landscape', pageSize: 'letter' }])
        .withDOM("<'row'<'col-sm-4'l><'col-sm-4 text-center'i><'col-sm-4'<'html5buttons'B>>><'row'<'col-sm-12'rt>><'row'<'col-sm-12'p>>");
    }

    var fetchPlayerStatCareers = function (playerType) {

      vm.dataLoaded = false;

      var data = [];

      var apiServiceType = "playerStatCareers";

      if (playerType === "goalie") {

        apiServiceType = "goalieStatCareers";

      }

      apiService[apiServiceType].list().then(function (fulfilled) {

        data = buildPlayerStatCareersToDisplay(fulfilled);

      }).finally(function () {
        
        deferred.resolve(data);

        vm.dataLoaded = true;

      });
    };

    var buildPlayerStatCareersToDisplay = function (playerStatCareers) {

      var playerStatCareersToDisplay = playerStatCareers.map(function (item, index) {

        item.rank = index + 1;

        if (screenSize.is('xs, sm')) {

          item.playerNameToDisplay = item.playerFirstName + '/n' + item.playerLastName;

          if (item.playerSuffix) {
            item.playerNameToDisplay = item.playerNameToDisplay + ' ' + item.playerSuffix;
          }

        } else if (screenSize.is('md')) {

          item.playerNameToDisplay = item.playerFirstName + '/n' + item.playerLastName;

          if (item.playerSuffix) {
            item.playerNameToDisplay = item.playerNameToDisplay + ' ' + item.playerSuffix;
          }

        } else {

          item.playerNameToDisplay = item.playerFirstName + ' ' + item.playerLastName;

          if (item.playerSuffix) {
            item.playerNameToDisplay = item.playerNameToDisplay + ' ' + item.playerSuffix;
          }

        }

        return item;
      });

      return playerStatCareersToDisplay;
    };

    var fetchData = function (playerType) {
      fetchPlayerStatCareers(playerType);
    };

    $scope.removeSearch = function () {
      $scope.searchText = null;
      dtCareers
       .search("")
       .draw();
    };

    $scope.performSearch = function () {

      var searchOn = $scope.searchText ? $scope.searchText : "";

      dtCareers
       .search(searchOn)
       .draw();
    };

    var setWatches = function () {

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

          dtCareers = val.DataTable;

          dtCareers.on('order.dt search.dt', function () {
            dtCareers.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
              cell.innerHTML = i + 1;
            });
          }).draw();

        }
      });
    };

    vm.$onInit = function () {

      vm.dataLoaded = false;

      deferred = $q.defer();

      vm.playerType = $state.params.playerType;

      vm.playerTypeTitle = "Skater";

      if (vm.playerType === "goalie") {
        vm.playerTypeTitle = "Goalie";
      }

      initDatatable(vm.playerType);

      $timeout(function () {
        setWatches();
        renderDatatable(vm.playerType);
        fetchData(vm.playerType);
      }, 100);  //needs to occur before the timeouts for the activetabs
    };

  }
);