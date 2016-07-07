'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.factory("returnUrlService",
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
