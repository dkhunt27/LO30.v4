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

      .state('root.statsLine', {
        url: "/statsline/seasons/:seasonId/seasontypes/:seasonTypeId",
        templateUrl: "js/statsLines/statsLines.html",
        controller: "statsLinesController",
        controllerAs: "vm",
        data: { pageTitle: 'Stats Lines' }
      })


      .state('root.profilesPlayers', {
        url: "/profiles/players/:playerId/playertypes/:playerType/seasons/:seasonId/seasontypes/:seasonTypeId?tab",
        templateUrl: "js/profilesPlayers/profilesPlayers.html",
        controller: "profilesPlayersController",
        controllerAs: "vm",
        data: { pageTitle: 'Player Profiles' }
      })

      .state('root.profilesPlayers2', {
        url: "/profiles/players/:playerId/playertypes/:playerType?tab",
        templateUrl: "js/profilesPlayers/profilesPlayers.html",
        controller: "profilesPlayersController",
        controllerAs: "vm",
        data: { pageTitle: 'Player Profiles' }
      })

      .state('root.profilesTeams', {
        url: "/profiles/teams/:teamId/seasons/:seasonId?tab",
        templateUrl: "js/profilesTeams/profilesTeams.html",
        controller: "profilesTeamsController",
        controllerAs: "vm",
        data: { pageTitle: 'Team Profiles' }
      })

      .state('root.profilesTeams2', {
        url: "/profiles/teams/:teamId?tab",
        templateUrl: "js/profilesTeams/profilesTeams.html",
        controller: "profilesTeamsController",
        controllerAs: "vm",
        data: { pageTitle: 'Team Profiles' }
      })

      .state('root.careers', {
        url: "/careers/playertypes/:playerType",
        templateUrl: "js/careers/careers.html",
        controller: "careersController",
        controllerAs: "vm",
        data: { pageTitle: 'Careers' }
      })

      .state('root.gameBoxScore', {
        url: "/gameBoxScore/games/:gameId/seasons/:seasonId",
        templateUrl: "js/gameBoxScore/gameBoxScore.html",
        controller: "gameBoxScoreController",
        controllerAs: "vm",
        data: { pageTitle: 'Game Box Score' }
      })

      .state('root.news', {
        url: "/news",
        templateUrl: "js/news/news.html",
        controller: "newsController",
        controllerAs: "vm",
        data: { pageTitle: 'News' }
      })

      .state('root.schedule', {
        url: "/schedule",
        templateUrl: "js/schedule/schedule.html",
        controller: "scheduleController",
        controllerAs: "vm",
        data: { pageTitle: 'Schedule' }
      })

      .state('root.about', {
        url: "/about",
        templateUrl: "js/about/about.html",
        controller: "aboutController",
        controllerAs: "vm",
        data: { pageTitle: 'About' }
      })

      .state('root.crudPlayers', {
        url: "/crud/players",
        templateUrl: "js/crud/players/crud.players.html",
        controller: "crudPlayersController",
        controllerAs: "vm",
        data: { pageTitle: 'Players CRUD' }
      })
      .state('root.crudScoreSheetEntrySubs', {
        url: "/crud/scoreSheetEntrySubs",
        templateUrl: "js/crud/scoreSheetEntrySubs/crud.scoreSheetEntrySubs.html",
        controller: "crudScoreSheetEntrySubsController",
        controllerAs: "vm",
        data: { pageTitle: 'Score Sheet Entry Subs CRUD' }
      })

      .state('root.adminScoreSheetEntry', {
        url: "/admin/scoreSheetEntry",
        templateUrl: "js/scoreSheetEntry/scoreSheetEntry.html",
        controller: "scoreSheetEntryController",
        controllerAs: "vm",
        data: { pageTitle: 'Score Sheet Entry' }
      })

    $urlRouterProvider.otherwise('/r/news');


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
