'use strict';

angular.module('lo30NgApp')
  .controller('profilesPlayersController', function ($log, $scope, $state, $timeout, $q, $compile, criteriaService, apiService, screenSize, externalLibService, broadcastService, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {

    var _ = externalLibService._;
    var sjv = externalLibService.sjv;

    var vm = this;

    var dataCareerDefer = $q.defer();
    var dataSeasonsDefer = $q.defer();
    var dataTeamsDefer = $q.defer();
    var dataGamesDefer = $q.defer();

    var initDatatable = function () {

      //define default option
      vm.dtOptions = {
        playerCareer: DTOptionsBuilder.newOptions(),
        playerSeasons: DTOptionsBuilder.newOptions(),
        playerTeams: DTOptionsBuilder.newOptions(),
        playerGames: DTOptionsBuilder.newOptions()
      }

      //define colum
      vm.dtColumns = {
        playerCareer: [
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
        ],
        playerSeasons: [
              DTColumnBuilder.newColumn('seasonName').withTitle('Season'),
              DTColumnBuilder.newColumn('games').withTitle('Games'),
              DTColumnBuilder.newColumn('goals').withTitle('Goals'),
              DTColumnBuilder.newColumn('assists').withTitle('Assists'),
              DTColumnBuilder.newColumn('points').withTitle('Points'),
              DTColumnBuilder.newColumn('penaltyMinutes').withTitle('PIM'),
              DTColumnBuilder.newColumn('powerPlayGoals').withTitle('PPG'),
              DTColumnBuilder.newColumn('shortHandedGoals').withTitle('SHG'),
              DTColumnBuilder.newColumn('gameWinningGoals').withTitle('GWG')
        ],
        playerTeams: [
              DTColumnBuilder.newColumn('playerNameToDisplay').withTitle('Player'),
              DTColumnBuilder.newColumn('teamNameToDisplay').withTitle('Team'),
              DTColumnBuilder.newColumn('playoffs').withTitle('Playoffs'),
              DTColumnBuilder.newColumn('games').withTitle('Games'),
              DTColumnBuilder.newColumn('goals').withTitle('Goals'),
              DTColumnBuilder.newColumn('assists').withTitle('Assists'),
              DTColumnBuilder.newColumn('points').withTitle('Points'),
              DTColumnBuilder.newColumn('penaltyMinutes').withTitle('PIM'),
              DTColumnBuilder.newColumn('powerPlayGoals').withTitle('PPG'),
              DTColumnBuilder.newColumn('shortHandedGoals').withTitle('SHG'),
              DTColumnBuilder.newColumn('gameWinningGoals').withTitle('GWG')
        ],
        playerGames: [
              DTColumnBuilder.newColumn('gameId').withTitle('Game'),
              DTColumnBuilder.newColumn('gameDateTime').withTitle('Date'),
              DTColumnBuilder.newColumn('teamCode').withTitle('Team'),
              DTColumnBuilder.newColumn('playoffs').withTitle('Playoffs'),
              DTColumnBuilder.newColumn('goals').withTitle('Goals'),
              DTColumnBuilder.newColumn('assists').withTitle('Assists'),
              DTColumnBuilder.newColumn('points').withTitle('Points'),
              DTColumnBuilder.newColumn('penaltyMinutes').withTitle('PIM'),
              DTColumnBuilder.newColumn('powerPlayGoals').withTitle('PPG'),
              DTColumnBuilder.newColumn('shortHandedGoals').withTitle('SHG'),
              DTColumnBuilder.newColumn('gameWinningGoals').withTitle('GWG')
        ]
      };

      vm.dtInstance = {
        playerCareer: {},
        playerSeasons: {},
        playerTeams: {},
        playerGames: {}
      };
    }

    var renderDatatable = function () {

      var career = DTOptionsBuilder
          .fromFnPromise(function () {
            return dataCareerDefer.promise;
          })
          .withOption('processing', false)
          .withOption('paging', false)
          .withOption('bFilter', false)
          .withOption('bInfo', false)
          .withOption('searching', false)
          .withOption('scrollX', true)
          .withBootstrap();

      var seasons = DTOptionsBuilder
          .fromFnPromise(function () {
            return dataSeasonsDefer.promise;
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

      var teams = DTOptionsBuilder
          .fromFnPromise(function () {
            return dataTeamsDefer.promise;
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

      var games = DTOptionsBuilder
          .fromFnPromise(function () {
            return dataGamesDefer.promise;
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
        playerCareer: career,
        playerSeasons: seasons,
        playerTeams: teams,
        playerGames: games
      };
    }

    var fetchPlayerStatCareer = function (playerId, type) {

      vm.careerDataLoaded = false;

      vm.playerStatCareer = {};

      var apiServiceType = "playerStatCareers";

      if (type === "goalie") {

        apiServiceType = "goalieStatCareers";

      }

      apiService[apiServiceType].getForPlayerId(playerId).then(function (fulfilled) {

        vm.playerStatCareer = fulfilled;

        vm.playerStatCareer = buildPlayerStatCareerToDisplay(vm.playerStatCareer);

      }).finally(function () {
        
        // convert single career stat into an array of one for datatable
        var careerTabCareerData = [];

        careerTabCareerData.push(vm.playerStatCareer);

        dataCareerDefer.resolve(careerTabCareerData);

        vm.careerDataLoaded = true;

      });
    };

    var fetchPlayerStatSeasons = function (playerId, type) {

      vm.seasonsDataLoaded = false;

      vm.playerStatSeasons = [];

      var apiServiceType = "playerStatSeasons";

      if (type === "goalie") {

        apiServiceType = "goalieStatSeasons";

      }

      apiService[apiServiceType].listForPlayerId(playerId).then(function (fulfilled) {

        vm.playerStatSeasons = _.sortBy(fulfilled, function (item) { return item.seasonName; });

        vm.playerStatSeasons = buildPlayerStatSeasonsToDisplay(vm.playerStatSeasons);

      }).finally(function () {

        dataSeasonsDefer.resolve(vm.playerStatSeasons);

        vm.seasonsDataLoaded = true;

      });
    };

    var fetchPlayerStatTeams = function (playerId, seasonId, type) {

      vm.teamsDataLoaded = false;

      vm.playerStatTeams = [];

      var apiServiceType = "playerStatTeams";

      if (type === "goalie") {

        apiServiceType = "goalieStatTeams";

      }

      apiService[apiServiceType].listForPlayerIdSeasonId(playerId, seasonId).then(function (fulfilled) {

        vm.playerStatTeams = _.sortBy(fulfilled, function (item) { return item.sub; });

        vm.playerStatTeams = buildPlayerStatTeamsToDisplay(vm.playerStatTeams);

      }).finally(function () {

        dataTeamsDefer.resolve(vm.playerStatTeams);

        vm.teamsDataLoaded = true;

      });

    };

    var fetchPlayerStatGames = function (playerId, seasonId, type) {

      vm.gamesDataLoaded = false;

      vm.playerStatGames = [];

      var apiServiceType = "playerStatGames";

      if (type === "goalie") {

        apiServiceType = "goalieStatGames";

      }

      apiService[apiServiceType].listForPlayerIdSeasonId(playerId, seasonId).then(function (fulfilled) {

        vm.playerStatGames = _.sortBy(fulfilled, function (item) { return item.gameId * -1; });

        vm.playerStatGames = buildPlayerStatGamesToDisplay(vm.playerStatGames);

      }).finally(function () {

        dataGamesDefer.resolve(vm.playerStatGames);

        vm.gamesDataLoaded = true;

      });
    };

    var buildPlayerStatCareerToDisplay = function (playerStatCareer) {

      var item = playerStatCareer;

      if (screenSize.is('xs, sm')) {

        item.playerNameToDisplay = item.playerFirstName + '<br/>' + item.playerLastName;

        if (item.playerSuffix) {
          item.playerNameToDisplay = item.playerNameToDisplay + ' ' + item.playerSuffix;
        }

      } else if (screenSize.is('md')) {

        item.playerNameToDisplay = item.playerFirstName + '<br/>' + item.playerLastName;

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
    };

    var buildPlayerStatSeasonsToDisplay = function (playerStatSeason) {

      var playerStatSeasonsToDisplay = playerStatSeason.map(function (item, index) {

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

      return playerStatSeasonsToDisplay;
    };

    var buildPlayerStatTeamsToDisplay = function (playerStatTeams) {

      var playerStatTeamsToDisplay = playerStatTeams.map(function (item, index) {

        item.rank = index + 1;

        if (screenSize.is('xs, sm')) {

          item.teamNameToDisplay = item.teamNameCode;
          item.playerNameToDisplay = item.playerFirstName + '<br/>' + item.playerLastName;

          if (item.playerSuffix) {
            item.playerNameToDisplay = item.playerNameToDisplay + ' ' + item.playerSuffix;
          }

        } else if (screenSize.is('md')) {

          item.teamNameToDisplay = item.teamNameShort;
          item.playerNameToDisplay = item.playerFirstName + '<br/>' + item.playerLastName;

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

      return playerStatTeamsToDisplay;
    };

    var buildPlayerStatGamesToDisplay = function (playerStatGames) {

      var playerStatGamesToDisplay = playerStatGames.map(function (item, index) {

        item.rank = index + 1;

        if (screenSize.is('xs, sm')) {

          item.teamNameToDisplay = item.teamNameCode;

        } else if (screenSize.is('md')) {

          item.teamNameToDisplay = item.teamNameShort;

        } else {

          item.teamNameToDisplay = item.teamNameShort;

        }

        return item;
      });

      return playerStatGamesToDisplay;
    };

    var fetchData = function (seasonId, seasonTypeId, playerId, playerType) {

      switch ($scope.local.tabActiveIndex) {
        case $scope.local.tabStates.career:

          fetchPlayerStatCareer(playerId, playerType);

          fetchPlayerStatSeasons(playerId, playerType);

          $state.params.tab = "career";

          break;
        case $scope.local.tabStates.season:

          fetchPlayerStatTeams(playerId, seasonId, playerType);

          fetchPlayerStatGames(playerId, seasonId, playerType);

          $state.params.tab = "season";

          break;
        default:
          $log.debug("tabActiveIndex not mapped for: ", $scope.local.tabActiveIndex);
      }
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

      $scope.$watch('local.tabActiveIndex', function (newVal, oldVal) {

        if (newVal > -1 && newVal !== oldVal) {

          fetchData(vm.seasonId, vm.seasonTypeId, vm.playerId, vm.playerType);

        }
      });

      $scope.$watch(function () { return $state.params.playerType; }, function (value) {
        vm.playerType = value;
      });

    };

    vm.$onInit = function () {

      vm.careerDataLoaded = false;

      $scope.local = {
        selectedPlayerId: 593,
        selectedSeasonId: 56,
        selectedPlayerType: 'skater',
        playerStatGames: [],
        playerStatTeams: [],
        playerStatSeasons: [],
        playerStatCareer: {},
        playerStatGamesToDisplay: [],
        playerStatTeamsToDisplay: [],
        playerStatSeasonsToDisplay: [],
        playerStatCareerToDisplay: [],
        fetchplayerStatGamesCompleted: false,
        fetchPlayerStatTeamsCompleted: false,
        fetchplayerStatSeasonsCompleted: false,
        fetchplayerStatCareerCompleted: false,

        tabActiveIndex: -1,
        tabStates: {
          career: 0,
          season: 1,
          profile: 2
        }
      };

      var season = criteriaService.seasons.get();

      vm.seasonId = season.seasonId;

      var seasonType = criteriaService.seasonTypes.get();

      vm.seasonTypeId = seasonType.seasonTypeId;

      vm.playerId = $state.params.playerId;

      vm.playerType = $state.params.playerType;

      // (this covers tab=career since initializes as index=0)
      $scope.local.tabActiveIndex = -1;

      if ($state.params.tab) {

        // use timeout to let the uib-tab initial the active states
        $timeout(function () {
          // map to active tab index
          $scope.local.tabActiveIndex = $scope.local.tabStates[$state.params.tab];
        }, 200);

      } else {

        // set default tab, after watches so correct data events fire
        // use timeout to let the uib-tab initial the active states
        $timeout(function () {
          $scope.local.tabActiveIndex = $scope.local.tabStates.season;  // set season as default tab
        }, 200);

      }

      initDatatable();

      $timeout(function () {
        setWatches();
        renderDatatable();
      }, 100);  //needs to occur before the timeouts for the activetabs
    };

  }
);