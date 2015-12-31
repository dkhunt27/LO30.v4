'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('standingsController',
  function ($log, $scope, $timeout, apiService, criteriaServiceResolved, screenSize, broadcastService, DTOptionsBuilder, DTColumnBuilder) {

    $scope.initializeScopeVariables = function () {

      $scope.local = {
        teamStandings: [],
        teamStandingsToDisplay: [],
        fetchTeamStandingsCompleted: false,

        dt: {
          options: DTOptionsBuilder.newOptions()
                        //.withOption('paging', false)
                        //.withOption('searching', false)
                        //.withDOM('<"wrapper"flipt>')
                        .withLightColumnFilter({
                          1: { "type": "text", "cssClass": "input-non-auto" },
                          2: { "type": "text", "cssClass": "input-non-auto" },
                          3: { "type": "text", "cssClass": "input-non-auto" },
                          4: { "type": "text", "cssClass": "input-non-auto" },
                          5: { "type": "text", "cssClass": "input-non-auto" },
                          6: { "type": "text", "cssClass": "input-non-auto" },
                          7: { "type": "text", "cssClass": "input-non-auto" },
                          8: { "type": "text", "cssClass": "input-non-auto" }
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
                        .withBootstrapOptions({
                          Buttons: {
                            defaults: {
                              dom: {
                                container: {
                                  className: 'col-xs-6 dt-buttons'
                                },
                                buttons: {
                                  normal: 'btn btn-danger'
                                }
                              }
                            }
                          }
          })
        }
      };



      //.withFixedColumns({
     //   leftColumns: 1
     // })


     //.withColumnFilter({
     //                     aoColumns: [
     //                     null, {
     //                       type: 'text',
     //                       bRegex: false,
     //                       bSmart: true
     //                     }, {
     //                       type: 'number',
     //                       bRegex: false
     //                     }, {
     //                       type: 'number',
     //                       bRegex: false
     //                     }, {
     //                       type: 'number',
     //                       bRegex: false
     //                     }, {
     //                       type: 'number',
     //                       bRegex: false
     //                     }, {
     //                       type: 'number',
     //                       bRegex: false
     //                     }, {
     //                       type: 'number',
     //                       bRegex: false
     //                     }, {
     //                       type: 'number',
     //                       bRegex: false
     //                     }, {
     //                       type: 'number',
     //                       bRegex: false
     //                     }, {
     //                       type: 'number',
     //                       bRegex: false
     //                     }, {
     //                       type: 'number',
     //                       bRegex: false
     //                     }]
     //                   })

    };

    $scope.fetchTeamStandings = function (seasonId, playoffs) {

      $scope.local.fetchTeamStandingsCompleted = false;

      $scope.local.teamStandings = [];

      apiService.teamStandings.listForSeasonIdPlayoffs(seasonId, playoffs).then(function (fulfilled) {

        $scope.local.teamStandings = fulfilled;

        $scope.buildTeamStandingsToDisplay();

      }).finally(function () {

        $scope.local.fetchTeamStandingsCompleted = true;

      });
    };

    $scope.buildTeamStandingsToDisplay = function () {

      $scope.local.teamStandingsToDisplay = $scope.local.teamStandings.map(function (item) {

        if (screenSize.is('xs, sm')) {

          item.teamNameToDisplay = item.teamCode;

        } else if (screenSize.is('md')) {

          item.teamNameToDisplay = item.teamNameShort;

        } else {

          item.teamNameToDisplay = item.teamNameLong;

        }

        return item;
      });

      $log.debug("teamStandingsToDisplay", $scope.local.teamStandingsToDisplay)
    };

    $scope.fetchData = function () {

      var criteriaSeason = criteriaServiceResolved.season.get();

      var criteriaSeasonType = criteriaServiceResolved.seasonType.get();

      var criteriaSeasonTypeBool;

      if (criteriaSeasonType === "Playoffs") {

        criteriaSeasonTypeBool = true;

      } else {

        criteriaSeasonTypeBool = false;

      }

      $scope.fetchTeamStandings(criteriaSeason.seasonId, criteriaSeasonTypeBool);
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

      $timeout(function () {
        var el = angular.element('datatables-filter-row');
        el.addClass("ng-hide");
      }, 100);
    };

    $scope.activate();
  }
);