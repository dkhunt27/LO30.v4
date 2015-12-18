'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.factory("adminDataProcessingService",
  [
    "$resource",
    'constApisUrl',
    function ($resource, constApisUrl) {

      var resource = $resource(constApisUrl + '/dataProcessing');

      var postAction = function (model) {
        return resource.save({}, model);
      };

      return {
        postAction: postAction
      };
    }
  ]
);

