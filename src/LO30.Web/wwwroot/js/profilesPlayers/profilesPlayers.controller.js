'use strict';

angular.module('lo30NgApp')
  .controller('profilesPlayersController', function ($log, $scope, $state, $timeout, $q, $compile, criteriaService, apiService, screenSize, externalLibService, broadcastService, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {

    var _ = externalLibService._;
    var sjv = externalLibService.sjv;

    var vm = this;
    var deferred = {};
    var tabStates = {
      career: 0,
      season: 1,
      profile: 2
    };

    var tabLoaded = [false, false, false] // must match tabStates length

    var initDatatable = function (playerType) {

      //define default option
      vm.dtOptions = {
        playerCareer: DTOptionsBuilder.newOptions(),
        playerSeasons: DTOptionsBuilder.newOptions(),
        playerTeams: DTOptionsBuilder.newOptions(),
        playerGames: DTOptionsBuilder.newOptions()
      }

      if (playerType === "skater") {
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
      } else {
        vm.dtColumns = {
          playerCareer: [
                DTColumnBuilder.newColumn('playerNameToDisplay').withTitle('Player'),
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
          ],
          playerSeasons: [
                DTColumnBuilder.newColumn('seasonName').withTitle('Season'),
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
          ],
          playerTeams: [
                DTColumnBuilder.newColumn('playerNameToDisplay').withTitle('Player'),
                DTColumnBuilder.newColumn('teamNameToDisplay').withTitle('Team'),
                DTColumnBuilder.newColumn('playoffs').withTitle('Playoffs'),
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
          ],
          playerGames: [
                DTColumnBuilder.newColumn('gameId').withTitle('Game'),
                DTColumnBuilder.newColumn('gameDateTime').withTitle('Date'),
                DTColumnBuilder.newColumn('teamCode').withTitle('Team'),
                DTColumnBuilder.newColumn('playoffs').withTitle('Playoffs'),
                DTColumnBuilder.newColumn('wins').withTitle('Win'),
                DTColumnBuilder.newColumn('goalsAgainst').withTitle('GA'),
                DTColumnBuilder.newColumn('shutouts').withTitle('Shutout'),
          ] 
        };
      }

      vm.dtInstance = {
        playerCareer: {},
        playerSeasons: {},
        playerTeams: {},
        playerGames: {}
      };
    }

    var renderDatatable = function (playerType) {

      var career = DTOptionsBuilder
          .fromFnPromise(function () {
            return deferred.career.promise;
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
            return deferred.seasons.promise;
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
            return deferred.teams.promise;
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
            return deferred.games.promise;
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

    var fetchPlayerStatCareer = function (playerId, playerType) {

      vm.careerDataLoaded = false;

      vm.playerStatCareer = {};

      var apiServiceType = "playerStatCareers";

      if (playerType === "goalie") {

        apiServiceType = "goalieStatCareers";

      }

      apiService[apiServiceType].getForPlayerId(playerId).then(function (fulfilled) {

        vm.playerStatCareer = buildPlayerStatCareerToDisplay(fulfilled);

      }).finally(function () {
        
        // convert single career stat into an array of one for datatable
        var careerTabCareerData = [];

        careerTabCareerData.push(vm.playerStatCareer);

        deferred.career.resolve(careerTabCareerData);

        vm.careerDataLoaded = true;

      });
    };

    var fetchPlayerStatSeasons = function (playerId, playerType) {

      vm.seasonsDataLoaded = false;

      vm.playerStatSeasons = [];

      var apiServiceType = "playerStatSeasons";

      if (playerType === "goalie") {

        apiServiceType = "goalieStatSeasons";

      }

      apiService[apiServiceType].listForPlayerId(playerId).then(function (fulfilled) {

        vm.playerStatSeasons = _.sortBy(fulfilled, function (item) { return item.seasonName; });

        vm.playerStatSeasons = buildPlayerStatSeasonsToDisplay(vm.playerStatSeasons);

      }).finally(function () {

        deferred.seasons.resolve(vm.playerStatSeasons);

        vm.seasonsDataLoaded = true;

      });
    };

    var fetchPlayerStatTeams = function (playerId, seasonId, playerType) {

      vm.teamsDataLoaded = false;

      vm.playerStatTeams = [];

      var apiServiceType = "playerStatTeams";

      if (playerType === "goalie") {

        apiServiceType = "goalieStatTeams";

      }

      apiService[apiServiceType].listForPlayerIdSeasonId(playerId, seasonId).then(function (fulfilled) {

        vm.playerStatTeams = _.sortBy(fulfilled, function (item) { return item.sub; });

        vm.playerStatTeams = buildPlayerStatTeamsToDisplay(vm.playerStatTeams);

      }).finally(function () {

        deferred.teams.resolve(vm.playerStatTeams);

        vm.teamsDataLoaded = true;

      });

    };

    var fetchPlayerStatGames = function (playerId, seasonId, playerType) {

      vm.gamesDataLoaded = false;

      vm.playerStatGames = [];

      var apiServiceType = "playerStatGames";

      if (playerType === "goalie") {

        apiServiceType = "goalieStatGames";

      }

      apiService[apiServiceType].listForPlayerIdSeasonId(playerId, seasonId).then(function (fulfilled) {

        vm.playerStatGames = _.sortBy(fulfilled, function (item) { return item.gameId * -1; });

        vm.playerStatGames = buildPlayerStatGamesToDisplay(vm.playerStatGames);

      }).finally(function () {

        deferred.games.resolve(vm.playerStatGames);

        vm.gamesDataLoaded = true;

      });
    };

    var fetchData = function (seasonId, seasonTypeId, playerId, playerType) {

      switch ($scope.tabActiveIndex) {
        case tabStates.career:

          fetchPlayerStatCareer(playerId, playerType);

          fetchPlayerStatSeasons(playerId, playerType);

          $state.params.tab = "career";

          break;
        case tabStates.season:

          fetchPlayerStatTeams(playerId, seasonId, playerType);

          fetchPlayerStatGames(playerId, seasonId, playerType);

          $state.params.tab = "season";

          break;
        default:
          $log.debug("tabActiveIndex not mapped for: ", $scope.tabActiveIndex);
      }
    };

    var setWatches = function () {

      $scope.$on(broadcastService.events().seasonSet, function () {

        var season = criteriaService.seasons.get();

        vm.seasonId = season.seasonId;

        fetchData(vm.seasonId, vm.seasonTypeId, vm.playerId, vm.playerType);

      });

      $scope.$on(broadcastService.events().seasonTypeSet, function () {

        var seasonType = criteriaService.seasonTypes.get();

        vm.seasonTypeId = seasonType.seasonTypeId;

        fetchData(vm.seasonId, vm.seasonTypeId, vm.playerId, vm.playerType);

      });

      $scope.$watch('tabActiveIndex', function (newVal, oldVal) {

        if (newVal > -1 && newVal !== oldVal) {

          if (!tabLoaded[newVal]) {
            // only fetch the data once per tab
            fetchData(vm.seasonId, vm.seasonTypeId, vm.playerId, vm.playerType);
            tabLoaded[newVal] = true;
          }

        }
      });

      $scope.$watch(function () { return $state.params.playerType; }, function (value) {
        vm.playerType = value;
      });

    };

    vm.$onInit = function () {

      vm.careerDataLoaded = false;

      $scope.tabActiveIndex = -1;

      deferred = {
        career: $q.defer(),
        seasons: $q.defer(),
        teams: $q.defer(),
        games: $q.defer()
      }

      var season = criteriaService.seasons.get();

      vm.seasonId = season.seasonId;

      var seasonType = criteriaService.seasonTypes.get();

      vm.seasonTypeId = seasonType.seasonTypeId;

      vm.playerId = $state.params.playerId;

      vm.playerType = $state.params.playerType;

      vm.playerTypeTitle = "Skater";

      if (vm.playerType === "goalie") {
        vm.playerTypeTitle = "Goalie";
      }

      if ($state.params.tab) {

        // use timeout to let the uib-tab initial the active states
        $timeout(function () {
          // map to active tab index
          $scope.tabActiveIndex = tabStates[$state.params.tab];
        }, 200);

      } else {

        // set default tab, after watches so correct data events fire
        // use timeout to let the uib-tab initial the active states
        $timeout(function () {
          $scope.tabActiveIndex = tabStates.season;  // set season as default tab
        }, 200);

      }

      initDatatable(vm.playerType);

      $timeout(function () {
        setWatches();
        renderDatatable(vm.playerType);
      }, 100);  //needs to occur before the timeouts for the activetabs
    };

  }
);