'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.factory("dataServicePlayersSubSearch",
  [
    "constApisUrl",
    "$resource",
    function (constApisUrl, $resource) {

      // return multiple items
      var resource = $resource(constApisUrl + '/playersSubSearch');
      var resourceByPositionRating = $resource(constApisUrl + '/playersSubSearch/:position/:ratingMin/:ratingMax', { position: '@position', ratingMin: '@ratingMin', ratingMax: '@ratingMax' });

      var listAll = function () {
        return resource.query();
      };

      var listByPositionRating = function (position, ratingMin, ratingMax) {
        return resourceByPositionRating.query({ position: position, ratingMin: ratingMin, ratingMax: ratingMax });
      };
      
      return {
        listAll: listAll,
        listByPositionRating: listByPositionRating
      };
    }
  ]
);

