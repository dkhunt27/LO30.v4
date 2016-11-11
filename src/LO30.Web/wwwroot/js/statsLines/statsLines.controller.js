'use strict';

angular.module('lo30NgApp')
  .controller('statsLinesController', function ($scope, $state, $timeout, $q, $compile, $log, criteriaService, apiService, screenSize, externalLibService, broadcastService, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {

    var _ = externalLibService._;
    var sjv = externalLibService.sjv;

    var vm = this;
    var deferred = {};


    var initDatatable = function () {

      vm.dtColumns = [
        DTColumnBuilder.newColumn('rank').withTitle('Rank'),
        DTColumnBuilder.newColumn('teamNameToDisplay').withTitle('Team')
          .renderWith(function (data, type, row, meta) {
            return'<a href="/#/r/profiles/teams/' + row.teamId + '/seasons/' + row.seasonId + '?tab=lines">' + data + '</a>';
          }),
        DTColumnBuilder.newColumn('line').withTitle('Line'),
        DTColumnBuilder.newColumn('plusMinus').withTitle('+/-')
          .renderWith(function (data, type, row, meta) {
            return row.goals - row.goalsAgainst;
          }),
        DTColumnBuilder.newColumn('goals').withTitle('Goals For'),
        DTColumnBuilder.newColumn('goalsAgainst').withTitle('Goals Against')
      ];

      vm.dtInstance = {};
    }

    var renderDatatable = function () {

      vm.dtOptions = DTOptionsBuilder
          .fromFnPromise(function () {
            return deferred.promise;
          })
          .withOption('processing', false)
          .withOption('paging', false)
          .withOption('bFilter', false)
          .withOption('bInfo', false)
          .withOption('searching', false)
          .withOption('scrollX', true)
          .withOption('order', [[3, "desc"]])
          .withBootstrap();
    };

    var buildLineStatsToDisplay = function (lineStats) {

      var lineStatsToDisplay = lineStats.map(function (item, index) {

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

      return lineStatsToDisplay;
    };

    var fetchLineStats = function (seasonId, seasonTypeId) {

      vm.dataLoaded = false;

      var lineStats = [];

      apiService.lineStatSeasons.listForSeasonIdSeasonTypeId(seasonId, seasonTypeId).then(function (fulfilled) {

        lineStats = buildLineStatsToDisplay(fulfilled);

      }).finally(function () {

        deferred.resolve(lineStats);

        $log.debug("lineStats", lineStats);

        vm.dataLoaded = true;
      });
    };

    var fetchData = function (seasonId, seasonTypeId) {

      fetchLineStats(seasonId, seasonTypeId);
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

      $scope.$watch(function () { return vm.dtInstance; }, function (val, oldVal) {
        if (val !== oldVal && val.DataTable) {

          val.DataTable.on('order.dt search.dt', function () {
            val.DataTable.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
              cell.innerHTML = i + 1;
            });
          }).draw();
        }
      });
    };

    vm.$onInit = function () {

      vm.dataLoaded = false;

      deferred = $q.defer();

      var season = criteriaService.seasons.get();

      vm.seasonId = season.seasonId;

      var seasonType = criteriaService.seasonTypes.get();

      vm.seasonTypeId = seasonType.seasonTypeId;

      initDatatable();

      $timeout(function () {
        fetchData(vm.seasonId, vm.seasonTypeId);
        setWatches();
        renderDatatable();
      }, 100); 
    };
  });
