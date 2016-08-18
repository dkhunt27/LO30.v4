//"use strict";

//var lo30NgApp = angular.module("lo30NgApp", [
//  'ui.router',     
//  'ui.bootstrap'
//]);

//lo30NgApp.constant("constApisUrl", "/api");

//lo30NgApp.constant("constScheduleTeamFeedBaseUrl", "localhost:5000");

//lo30NgApp.config(function ($stateProvider, $urlRouterProvider) { //, IdleProvider, KeepaliveProvider) {

//  // Configure Idle settings
//  //IdleProvider.idle(5); // in seconds
//  //IdleProvider.timeout(120); // in seconds

//  $urlRouterProvider.otherwise("/r/standings");

//  $stateProvider

//    .state('root', {
//      abstract: true,
//      url: "/r",
//      templateUrl: "views/common/content.html",
//      controller: "rootController",
//      resolve: {
//        screenSizeResolved: function (screenSize) {
//          var screenSizeIsDesktop = screenSize.is('lg');
//          var screenSizeIsTablet = screenSize.is('md');
//          var screenSizeIsMobile = screenSize.is('xs, sm');

//          return {
//            isDesktop: screenSizeIsDesktop,
//            isTablet: screenSizeIsTablet,
//            isMobile: screenSizeIsMobile
//          }
//        },
//        sideMenuCollapseResolved: function (screenSizeResolved) {
//          //eehNavigationSidebar.menuName = "abc";

//        }
//      }
//    })
//    .state('root.main', {
//      url: "/main",
//      templateUrl: "views/main.html",
//      controller: "mainController"
//    })
//    .state('root.careers', {
//      url: "/careers/playertypes/:playerType",
//      templateUrl: "views/careers.html",
//      controller: "careersController"
//    })
//    .state('root.stats', {
//      url: "/stats/playertypes/:playerType",
//      templateUrl: "views/statsPlayers.html",
//      controller: "statsPlayersController"
//    })
//    .state('root.stats2', {
//      url: "/stats/playertypes/:playerType/seasons/:seasonId/seasontypes/:seasonTypeId",
//      templateUrl: "views/statsPlayers.html",
//      controller: "statsPlayersController"
//    })
//    .state('root.standings', {
//      url: "/standings",
//      templateUrl: "views/standings.html",
//      controller: "standingsController"
//    })
//    .state('root.players', {
//      url: "/players/:playerId/playertypes/:playerType?tab",
//      templateUrl: "views/players.html",
//      controller: "playersController"
//    })
//    .state('root.teams', {
//      url: "/teams/:teamId",
//      templateUrl: "views/teams.html",
//      controller: "teamsController"
//    })
//    .state('root.boxscores', {
//      url: "/boxscores/games/:gameId",
//      templateUrl: "views/gameBoxScore.html",
//      controller: "gameBoxScoreController"
//    })
//    .state('root.gallery', {
//      url: "/gallery/teams/seasons/:seasonId",
//      templateUrl: "views/galleryTeams.html",
//      controller: "galleryTeamsController"
//    })
//});

