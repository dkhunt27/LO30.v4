'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('newsController',
  [
    "$scope",
    "$http",
    "newsService",
    function ($scope, $http, newsService) {
      $scope.data = dataService;
      $scope.articles = [];
      $scope.isBusy = false;

      if (newsService.isReady() === false) {
        $scope.isBusy = true;

        newsService.getArticles()
          .then(function () {
            // success
            angular.copy(newsService.articles, $scope.articles);
          },
          function () {
            // error
            alert("could not load articles");
          })
          .then(function () {
            $scope.isBusy = false;
          });
      }
    }
  ]
);
