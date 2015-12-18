'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.factory("dataServiceSeasons",
  [
    "constApisUrl",
    "$resource",
    function (constApisUrl, $resource) {

      var resourceSeasons = $resource(constApisUrl + '/seasons');

      var listSeasons = function () {
        return resourceSeasons.query().$promise;
      };

      return {
        listSeasons: listSeasons
      };
    }
  ]
);

