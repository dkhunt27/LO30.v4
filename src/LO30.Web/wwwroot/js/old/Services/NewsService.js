'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.factory("newsService",
  [
    "$http",
    "$q",
    'constApisUrl',
    function ($http, $q, constApisUrl) {

      var _articles = [];
      var _isInit = false;

      var _isReady = function () {
        return _isInit;
      };

      var _getArticles = function () {

        var deferred = $q.defer();

        $http.get(constApisUrl + "/articles")
          .then(function (result) {
            // Successful
            angular.copy(result.data, _articles);
            _isInit = true;
            deferred.resolve();
          },
          function () {
            // Error
            deferred.reject();
          });

        return deferred.promise;
      };

      var _addArticle = function (newArticle) {
        var deferred = $q.defer();

        $http.post(constApisUrl + "/articles", newArticle)
         .then(function (result) {
           // success
           var newlyCreatedArticle = result.data;
           _articles.splice(0, 0, newlyCreatedArticle);
           deferred.resolve(newlyCreatedArticle);
         },
         function () {
           // error
           deferred.reject();
         });

        return deferred.promise;
      };

      function _findArticle(id) {
        var found = null;

        $.each(_articles, function (i, item) {
          if (item.id === id) {
            found = item;
            return false;
          }
        });

        return found;
      }

      var _getArticleById = function (id) {
        var deferred = $q.defer();

        if (_isReady()) {
          var article = _findArticle(id);
          if (article) {
            deferred.resolve(article);
          } else {
            deferred.reject();
          }
        } else {
          _getArticles()
            .then(function () {
              // success
              var article = _findArticle(id);
              if (article) {
                deferred.resolve(article);
              } else {
                deferred.reject();
              }
            },
            function () {
              // error
              deferred.reject();
            });
        }

        return deferred.promise;
      };

      return {
        articles: _articles,
        getArticles: _getArticles,
        addArticle: _addArticle,
        isReady: _isReady,
        getArticleById: _getArticleById,
      };
    }
  ]
);


