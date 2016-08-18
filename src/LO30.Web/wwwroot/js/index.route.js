(function() {
  'use strict';

  angular
    .module('lo30NgApp')
    .config(routerConfig);

  angular
    .module('lo30NgApp')
    .config(['$urlRouterProvider', function ($urlRouterProvider) {
      $urlRouterProvider.deferIntercept();
    }])

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('root', {
        abstract: true,
        url: "/r",
        templateUrl: "js/components/common/root.html"
      })

      .state('root.main', {
        url: "/main",
        templateUrl: "js/main/main.html",
        controller: "mainController",
        controllerAs: "vm",
        data: { pageTitle: 'Main view' }
      })

      .state('root.standings', {
        url: "/standings/seasons/:seasonId/seasontypes/:seasonTypeId",
        templateUrl: "js/standings/standings.html",
        controller: "standingsController",
        controllerAs: "vm",
        data: { pageTitle: 'Standings' }
      })
      .state('root.standings2', {
        url: "/standings",
        templateUrl: "js/standings/standings.html",
        controller: "standingsController",
        controllerAs: "vm",
        data: { pageTitle: 'Standings' }
      })

      .state('root.stats', {
        url: "/stats/playertypes/:playerType/seasons/:seasonId/seasontypes/:seasonTypeId",
        templateUrl: "js/statsPlayers/statsPlayers.html",
        controller: "statsPlayersController",
        controllerAs: "vm",
        data: { pageTitle: 'Stats' }
      })

      .state('root.stats2', {
        url: "/stats/playertypes/:playerType",
        templateUrl: "js/statsPlayers/statsPlayers.html",
        controller: "statsPlayersController",
        controllerAs: "vm",
        data: { pageTitle: 'Stats' }
      })

    $urlRouterProvider.otherwise('/r/standings');


//    .menuItem('lo30Menu.standings', {
//      text: 'Standings',
//      iconClass: 'fa-group',
//      href: '/Ng#/r/standings'
//    })

//.menuItem('lo30Menu.stats', {
//  text: 'Stats',
//  iconClass: 'fa-user'
//})
//.menuItem('lo30Menu.stats.skaters', {
//  text: 'Skaters',
//  href: '/Ng#/r/stats/playertypes/skater'
//})
//.menuItem('lo30Menu.stats.goalies', {
//  text: 'Goalies',
//  href: '/Ng#/r/stats/playertypes/goalie'
//})

//.menuItem('lo30Menu.careers', {
//  text: 'Careers',
//  iconClass: 'fa-user-plus'
//})
//.menuItem('lo30Menu.careers.skaters', {
//  text: 'Skaters',
//  href: '/Ng#/r/careers/playertypes/skater'
//})
//.menuItem('lo30Menu.careers.goalies', {
//  text: 'Goalies',
//  href: '/Ng#/r/careers/playertypes/goalie'
//});
  }

})();
