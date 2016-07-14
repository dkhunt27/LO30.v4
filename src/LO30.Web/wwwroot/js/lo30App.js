"use strict";

var lo30NgApp = angular.module("lo30NgApp", [
  'eehNavigation',
  'pascalprecht.translate',
  'ui.router',                    
  'ngAnimate',
  'ui.bootstrap',
  'ui.select',
  'ngSanitize',
  'matchMedia',
  'bootstrapLightbox'
]);

lo30NgApp.constant("constApisUrl", "/api");

lo30NgApp.constant("constScheduleTeamFeedBaseUrl", "localhost:5000");

lo30NgApp.config(function ($stateProvider, $urlRouterProvider) { //, IdleProvider, KeepaliveProvider) {

  // Configure Idle settings
  //IdleProvider.idle(5); // in seconds
  //IdleProvider.timeout(120); // in seconds

  $urlRouterProvider.otherwise("/r/standings");

  $stateProvider

    .state('root', {
      abstract: true,
      url: "/r",
      templateUrl: "views/shared/content.html",
      resolve: {
        /*criteriaServiceResolved: [
          'criteriaService',
          function (criteriaService) {
            return criteriaService.initialize().then(function (fulfilled) {
              return criteriaService;
            });
          }
        ]*/
      }
    })
    .state('root.careers', {
      url: "/careers/playertypes/:playerType",
      templateUrl: "views/careers.html",
      controller: "careersController",
      data: {
        requiresLogin: false
      }
    })
    .state('root.stats', {
      url: "/stats/playertypes/:playerType",
      templateUrl: "views/statsPlayers.html",
      controller: "statsPlayersController",
      data: {
        requiresLogin: false
      }
    })
    .state('root.stats2', {
      url: "/stats/playertypes/:playerType/seasons/:seasonId/seasontypes/:seasonTypeId",
      templateUrl: "views/statsPlayers.html",
      controller: "statsPlayersController",
      data: {
        requiresLogin: false
      }
    })
    .state('root.standings', {
      url: "/standings",
      templateUrl: "views/standings.html",
      controller: "standingsController",
      data: {
        requiresLogin: false
      }
    })
    .state('root.players', {
      url: "/players/:playerId/playertypes/:playerType?tab",
      templateUrl: "views/players.html",
      controller: "playersController",
      data: {
        requiresLogin: false
      }
    })
    .state('root.teams', {
      url: "/teams/:teamId",
      templateUrl: "views/teams.html",
      controller: "teamsController",
      data: {
        requiresLogin: false
      }
    })
    .state('root.boxscores', {
      url: "/boxscores/games/:gameId",
      templateUrl: "views/gameBoxScore.html",
      controller: "gameBoxScoreController",
      data: {
        requiresLogin: false
      }
    })
    .state('root.gallery', {
      url: "/gallery/teams/seasons/:seasonId",
      templateUrl: "views/galleryTeams.html",
      controller: "galleryTeamsController",
      data: {
        requiresLogin: false
      }
    })
});

lo30NgApp.config(['eehNavigationProvider', function (eehNavigationProvider) {

  // set font awesome as default
  eehNavigationProvider.iconBaseClass('fa');
  eehNavigationProvider.defaultIconClassPrefix('fa');

  // Add nested user links to the "lo30Menu" menu.
  eehNavigationProvider

    .menuItem('lo30Menu.standings', {
      text: 'Standings',
      iconClass: 'fa-group',
      href: '/Ng#/r/standings'
    })

    .menuItem('lo30Menu.stats', {
      text: 'Stats',
      iconClass: 'fa-user'
    })
    .menuItem('lo30Menu.stats.skaters', {
      text: 'Skaters',
      href: '/Ng#/r/stats/playertypes/skater'
    })
    .menuItem('lo30Menu.stats.goalies', {
      text: 'Goalies',
      href: '/Ng#/r/stats/playertypes/goalie'
    })

    .menuItem('lo30Menu.careers', {
      text: 'Careers',
      iconClass: 'fa-user-plus'
    })
    .menuItem('lo30Menu.careers.skaters', {
      text: 'Skaters',
      href: '/Ng#/r/careers/playertypes/skater'
    })
    .menuItem('lo30Menu.careers.goalies', {
      text: 'Goalies',
      href: '/Ng#/r/careers/playertypes/goalie'
    });

  // Add a menu item that links to "/home" to the "bar" menu.
  /*eehNavigationProvider
    .menuItem('lo30Menu.home', {
      text: 'Home',
      iconClass: 'fa-home',
      href: '/Home'
    });*/
}]);

lo30NgApp.config(function (LightboxProvider) {
  LightboxProvider.templateUrl = 'views/lightbox.html';
});

lo30NgApp.config(function ($logProvider, $provide) {

  var logAllowLog = true;
  var logAllowInfo = true;
  var logAllowDebug = true;

  $logProvider.debugEnabled(logAllowDebug);

  $provide.decorator('$log', function ($delegate) {
    //Original methods
    var origInfo = $delegate.info;
    var origLog = $delegate.log;

    //Override the default behavior
    $delegate.info = function () {

      if (logAllowInfo) {
        origInfo.apply(null, arguments);
      }
    };

    //Override the default behavior    
    $delegate.log = function () {

      if (logAllowLog) {
        origLog.apply(null, arguments);
      }
    };

    return $delegate;
  });
});

/*
lo30NgApp.config(function ($httpProvider) {

  $httpProvider.interceptors.push(function ($timeout, $q, $injector) {
    var loginModal, $http, $state;

    // this trick must be done so that we don't receive
    // `Uncaught Error: [$injector:cdep] Circular dependency found`
    $timeout(function () {
      loginModal = $injector.get('loginModal');
      $http = $injector.get('$http');
      $state = $injector.get('$state');
    });

    return {
      responseError: function (rejection) {
        if (rejection.status !== 401) {
          return rejection;
        }

        var deferred = $q.defer();

        loginModal()
          .then(function () {
            deferred.resolve($http(rejection.config));
          })
          .catch(function () {
            $state.go('welcome');
            deferred.reject(rejection);
          });

        return deferred.promise;
      }
    };
  });

});*/

/*
lo30NgApp.run(function ($rootScope) {

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    var requiresLogin = toState.data.requiresLogin;

    if (requiresLogin && typeof $rootScope.currentUser === 'undefined') {
      event.preventDefault();

      loginModal()
       .then(function () {
         return $state.go(toState.name, toParams);
       })
       .catch(function () {
         return $state.go('welcome');
       });
    }
  });

});*/
