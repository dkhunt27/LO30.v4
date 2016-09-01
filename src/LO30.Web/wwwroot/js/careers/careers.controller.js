'use strict';

angular.module('lo30NgApp')
  .controller('careersController', function ($log, $scope, $state, $timeout, $q, $compile, criteriaService, apiService, screenSize, externalLibService, broadcastService, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {

    var _ = externalLibService._;
    var sjv = externalLibService.sjv;

    var vm = this;
    var deferred = {};

    var initDatatable = function () {

      //define default option
      vm.dtOptions = DTOptionsBuilder.newOptions();

      //define colum
      vm.dtColumns = [
        DTColumnBuilder.newColumn('rank').withTitle('Rank'),
        DTColumnBuilder.newColumn('playerNameToDisplay').withTitle('Player'),
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

      vm.dtInstance = {};
    }

    var renderDatatable = function () {

      vm.dtOptions = DTOptionsBuilder
          .fromFnPromise(function () {
            return deferred.promise;
          })
          .withOption('processing', false)
          .withOption('paging', true)
          .withOption('bFilter', false)
          .withOption('bInfo', true)
          .withOption('searching', false)
          .withOption('scrollX', true)
          .withBootstrap();
    }

    var fetchPlayerStatCareers = function (type) {

      vm.dataLoaded = false;

      var data = [];

      var apiServiceType = "playerStatCareers";

      if (type === "goalie") {

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

    var setWatches = function () {

      $scope.$watch(function () { return $state.params.playerType; }, function (value) {
        vm.playerType = value;
      });

    };

    vm.$onInit = function () {

      vm.dataLoaded = false;

      deferred = $q.defer();

      vm.playerType = $state.params.playerType;

      initDatatable();

      $timeout(function () {
        setWatches();
        renderDatatable();
        fetchData(vm.playerType);
      }, 100);  //needs to occur before the timeouts for the activetabs
    };

  }
);