var lo30NgApp = angular.module("lo30NgApp", ['ngRoute', 'ngResource', 'ngAnimate', 'ui.bootstrap', 'toaster', 'angularMoment', 'isteven-multi-select']);

lo30NgApp.constant("constApisUrl", "/api/v3");
lo30NgApp.constant("constCurrentSeasonId", 56);

lo30NgApp.value("valSelectedSeason", null);

lo30NgApp.config(
  [
    "$routeProvider",
    function ($routeProvider) {
      // Admin Directive Work
      $routeProvider.when("/Admin/Test/DirectiveIamTesting", {
        controller: "testDirectiveIamTestingController",
        templateUrl: "/Templates/Admin/Test/DirectiveIamTesting.html"
      });
      $routeProvider.when("/Admin/Test/PlayerSubSearch", {
        controller: "testPlayerSubSearchController",
        templateUrl: "/Templates/Admin/Test/PlayerSubSearch.html"
      });
      $routeProvider.when("/Admin/Test/BoxScore", {
        controller: "testBoxScoreController",
        templateUrl: "/Templates/Admin/Test/BoxScore.html"
      });

      // Admin
      $routeProvider.when("/Admin/DataProcessing", {
        controller: "adminDataProcessingController",
        templateUrl: "/Templates/Admin/DataProcessing.html"
      });
      $routeProvider.when("/Admin/Settings", {
        controller: "adminSettingsController",
        templateUrl: "/Templates/Admin/Settings.html"
      });

      // Directives

      // Games
      $routeProvider.when("/Games/BoxScores/:gameId", {
        controller: "gamesBoxScoresController",
        templateUrl: "/Templates/Games/BoxScores.html"
      });
      $routeProvider.when("/Games/Results/:seasonId/:playoffs/:teamId", {
        controller: "gamesResultsController",
        templateUrl: "/Templates/Games/Results.html"
      });

      // Home

      // Players
      $routeProvider.when("/Players/Player", {
        controller: "playersPlayerController",
        templateUrl: "/Templates/Players/Player.html"
      });
      $routeProvider.when("/Players/Player/:playerId", {
        controller: "playersPlayerController",
        templateUrl: "/Templates/Players/Player.html"
      });
      $routeProvider.when("/Players/Player/:playerId/:seasonId", {
        controller: "playersPlayerController",
        templateUrl: "/Templates/Players/Player.html"
      });
      $routeProvider.when("/Players/Goalie", {
        controller: "playersPlayerController",
        templateUrl: "/Templates/Players/Player.html"
      });
      $routeProvider.when("/Players/Goalie/:playerId", {
        controller: "playersGoalieController",
        templateUrl: "/Templates/Players/Goalie.html"
      });
      $routeProvider.when("/Players/Goalie/:playerId/:seasonId", {
        controller: "playersGoalieController",
        templateUrl: "/Templates/Players/Goalie.html"
      });

      // ScoreSheets
      $routeProvider.when("/Games/BoxScores", {
        controller: "gamesBoxScoresController",
        templateUrl: "/Templates/Games/BoxScores.html"
      });
      $routeProvider.when("/ScoreSheets/Entry/:gameId", {
        controller: "scoreSheetsEntryController",
        templateUrl: "/Templates/ScoreSheets/Entry.html",
        resolve: {
          teamGameRosterHomeResolved: [
              '$location',
              '$route',
              'dataServiceResponseHandler',
              'dataServiceTeamGameRosters',
              function ($location, $route, dataServiceResponseHandler, dataServiceTeamGameRosters) {
                return dataServiceTeamGameRosters.listTeamGameRosterByGameIdAndHomeTeam($route.current.params.gameId, true).then(function (result) {
                  return dataServiceResponseHandler.reponseListMustBePopulated(result);
                }).then(function (fulfilled) {
                  return fulfilled;
                }, function (rejected) {
                  $location.path('/error');
                });
              }
          ],
          teamGameRosterAwayResolved: [
              '$location',
              '$route',
              'dataServiceResponseHandler',
              'dataServiceTeamGameRosters',
              function ($location, $route, dataServiceResponseHandler, dataServiceTeamGameRosters) {
                return dataServiceTeamGameRosters.listTeamGameRosterByGameIdAndHomeTeam($route.current.params.gameId, false).then(function (result) {
                  return dataServiceResponseHandler.reponseListMustBePopulated(result);
                }).then(function (fulfilled) {
                  return fulfilled;
                }, function (rejected) {
                  $location.path('/error');
                });
              }
          ]
        }
      });

      // Standings
      $routeProvider.when("/Standings/RegularSeason", {
        controller: "standingsRegularSeasonController",
        templateUrl: "/Templates/Standings/RegularSeason.html"
      });
      $routeProvider.when("/Standings/Playoffs", {
        controller: "standingsPlayoffsController",
        templateUrl: "/Templates/Standings/Playoffs.html"
      });

      // Stats
      $routeProvider.when("/Stats/Players/:seasonId/:playoffs", {
        controller: "statsPlayersController",
        templateUrl: "/Templates/Stats/Players.html"
      });
      $routeProvider.when("/Stats/Goalies/:seasonId/:playoffs", {
        controller: "statsGoaliesController",
        templateUrl: "/Templates/Stats/Goalies.html"
      });

      // Schedule
      $routeProvider.when("/Schedule/Settings/:seasonId/:playoffs/:teamId", {
        controller: "iCalController",
        templateUrl: "/Templates/iCal.html"
      });


      $routeProvider.when("/News", {
        controller: "newsController",
        templateUrl: "/Templates/articlesView.html"
      });



      $routeProvider.when("/", {
        controller: "homeController",
        templateUrl: "/Templates/Home/Index.html"
      });
    }
  ]
);