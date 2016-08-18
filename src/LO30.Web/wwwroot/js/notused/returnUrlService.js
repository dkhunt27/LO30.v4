'use strict';

angular.module('lo30NgApp')
  .factory("returnUrlService",
    function ($log, apiBaseService) {

      var baseApiUrl = "/api/";

      var service = {};

      service.set = function (returnUrl) {
        var inputs = {
          apiDataType: "returnUrl.set",
          urlPartial: "returnurl",
          method: "POST",
          params: {
            returnUrl: returnUrl
          }
        }
        return apiBaseService.execute(inputs);
      }

      return service;
    }
);
