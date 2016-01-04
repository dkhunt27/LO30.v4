"use strict";

var lo30NgApp = angular.module("lo30NgApp", [
  'ngRoute', 
  'ngAnimate',
  'ui.bootstrap',
  'ui.select',
  'ngSanitize',
  'matchMedia',
  'datatables',
  'datatables.bootstrap',
  'datatables.buttons',
  'datatables.light-columnfilter',
  'datatables.fixedcolumns'
]);

lo30NgApp.constant("constApisUrl", "/api");

lo30NgApp.config(function ($routeProvider) {

  $routeProvider.when("/standings", {
    controller: "standingsController",
    templateUrl: "/views/standings.html",
    resolve: {
      criteriaServiceResolved: [
        'criteriaService',
        function (criteriaService) {
          return criteriaService.initialize().then(function(fulfilled) {
            return criteriaService;
          });
        }
      ]
    }
  });

  $routeProvider.when("/stats/players", {
    controller: "statsPlayersController",
    templateUrl: "/views/statsPlayers.html",
    resolve: {
      criteriaServiceResolved: [
        'criteriaService',
        function (criteriaService) {
          return criteriaService.initialize().then(function (fulfilled) {
            return criteriaService;
          });
        }
      ]
    }
  });

  $routeProvider.when("/players/:playerId", {
    controller: "playersController",
    templateUrl: "/views/players.html",
    resolve: {
      criteriaServiceResolved: [
        'criteriaService',
        function (criteriaService) {
          return criteriaService.initialize().then(function (fulfilled) {
            return criteriaService;
          });
        }
      ]
    }
  });

  $routeProvider.when("/players/:playerId/seasons/:seasonId", {
    controller: "playersController",
    templateUrl: "/views/players.html",
    resolve: {
      criteriaServiceResolved: [
        'criteriaService',
        function (criteriaService) {
          return criteriaService.initialize().then(function (fulfilled) {
            return criteriaService;
          });
        }
      ]
    }
  });

  $routeProvider.when("/teams/:teamId/seasons/:seasonId", {
    controller: "teamsController",
    templateUrl: "/views/teams.html",
    resolve: {
      criteriaServiceResolved: [
        'criteriaService',
        function (criteriaService) {
          return criteriaService.initialize().then(function (fulfilled) {
            return criteriaService;
          });
        }
      ]
    }
  });

  $routeProvider.when("/boxscores/games/:gameId/seasons/:seasonId", {
    controller: "gameBoxScoreController",
    templateUrl: "/views/gameBoxScore.html",
    resolve: {
      criteriaServiceResolved: [
        'criteriaService',
        function (criteriaService) {
          return criteriaService.initialize().then(function (fulfilled) {
            return criteriaService;
          });
        }
      ]
    }
  });

  $routeProvider.otherwise({ redirectTo: "/" });
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