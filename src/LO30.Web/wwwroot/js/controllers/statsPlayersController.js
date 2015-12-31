'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('statsPlayersController',
    function ($scope, apiService, criteriaService, screenSize, broadcastService, externalLibService, DTOptionsBuilder, DTColumnBuilder) {

      var _ = externalLibService._;

      $scope.initializeScopeVariables = function () {

        $scope.local = {
          playerStatTeams: [],
          playerStatTeamsToDisplay: [],
          fetchPlayerStatTeamsCompleted: false,

          dt: {
            options: DTOptionsBuilder.newOptions()
                        //.withOption('paging', false)
                        //.withOption('searching', false)
                        //.withDOM('<"wrapper"flipt>')
                        .withOption('order', [5, 'desc'])
                        .withOption('fnRowCallback', function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                          var index = iDisplayIndex + 1;
                          $('td:eq(0)', nRow).html(index);
                          return nRow;
                        })
                        //.withOption('scrollY', '300px')
                        //.withOption('scrollX', '100%')
                        //.withOption('scrollCollapse', true)
                        //.withFixedColumns({
                        //  leftColumns: 2
                        //})
                        .withLightColumnFilter({
                          1: { "type": "text", "cssClass": "input-non-auto" },
                          2: { "type": "text", "cssClass": "input-non-auto" },
                          3: { "type": "text", "cssClass": "input-non-auto" },
                          4: { "type": "text", "cssClass": "input-non-auto" },
                          5: { "type": "text", "cssClass": "input-non-auto" },
                          6: { "type": "text", "cssClass": "input-non-auto" },
                          7: { "type": "text", "cssClass": "input-non-auto" },
                          8: { "type": "text", "cssClass": "input-non-auto" },
                          9: { "type": "text", "cssClass": "input-non-auto" },
                          10: { "type": "text", "cssClass": "input-non-auto" },
                          11: { "type": "text", "cssClass": "input-non-auto" },
                          12: { "type": "text", "cssClass": "input-non-auto" },
                          13: { "type": "text", "cssClass": "input-non-auto" }
                        })
                        .withButtons([
                          'copy',
                          'print',
                          'excel',
                          {
                            text: '<span><span class="fa fa-filter"></span>Filter</span>',
                            key: '1',
                            action: function (e, dt, node, config) {
                              var el = $("#datatables-filter-row").toggle();
                            }
                          }
                        ])
                        .withBootstrap()
          }
        };
      };

      $scope.fetchPlayerStatTeams = function (seasonId, playoffs) {

        $scope.local.fetchPlayerStatTeamsCompleted = false;

        $scope.local.playerStatTeams = [];

        apiService.playerStatTeams.listForSeasonIdPlayoffs(seasonId, playoffs).then(function (fulfilled) {

          $scope.local.playerStatTeams = _.sortBy(fulfilled, function(item) { return item.points * -1; });

          $scope.buildPlayerStatTeamsToDisplay();

        }).finally(function () {

          $scope.local.fetchPlayerStatTeamsCompleted = true;

        });
      };

      $scope.buildPlayerStatTeamsToDisplay = function () {


        $scope.local.playerStatTeamsToDisplay = $scope.local.playerStatTeams.map(function (item, index) {

          item.rank = index + 1;

          if (screenSize.is('xs, sm')) {

            item.teamNameToDisplay = item.teamCode;
            item.playerNameToDisplay = item.firstName + ' ' + item.lastName;

            if (item.suffix) {
              item.playerNameToDisplay = item.playerNameToDisplay + ' ' + item.suffix;
            }

          } else if (screenSize.is('md')) {

            item.teamNameToDisplay = item.teamNameShort;
            item.playerNameToDisplay = item.firstName + ' ' + item.lastName;

            if (item.suffix) {
              item.playerNameToDisplay = item.playerNameToDisplay + ' ' + item.suffix;
            }

          } else {

            item.teamNameToDisplay = item.teamNameShort;
            item.playerNameToDisplay = item.firstName + ' ' + item.lastName;

            if (item.suffix) {
              item.playerNameToDisplay = item.playerNameToDisplay + ' ' + item.suffix;
            }

          }

          return item;
        });
      };

      $scope.fetchData = function () {
        var criteriaSeason = criteriaService.season.get();

        var criteriaSeasonType = criteriaService.seasonType.get();

        var criteriaSeasonTypeBool;

        if (criteriaSeasonType === "Playoffs") {

          criteriaSeasonTypeBool = true;

        } else {

          criteriaSeasonTypeBool = false;

        }

        $scope.fetchPlayerStatTeams(criteriaSeason.seasonId, criteriaSeasonTypeBool);
      };

      $scope.setWatches = function () {

        $scope.$on(broadcastService.events().seasonSet, function () {

          $scope.fetchData();

        });

        $scope.$on(broadcastService.events().seasonTypeSet, function () {

          $scope.fetchData();

        });
      };

      $scope.activate = function () {

        $scope.initializeScopeVariables();

        $scope.setWatches();

        $scope.fetchData();

      };

      $scope.activate();
    }
);