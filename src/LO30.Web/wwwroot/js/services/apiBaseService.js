'use strict';

angular.module('lo30NgApp')
  .factory("apiBaseService",
    function ($log, $http) {

      var baseApiUrl = "/api/";

      var service = {};

      service.execute = function (fnInputs) {

        var apiDataType = fnInputs.apiDataType;
        var urlPartial = fnInputs.urlPartial;
        var method = fnInputs.method;
        var params = fnInputs.params;

        var url = baseApiUrl + urlPartial;

        var httpConfig = {
          url: url,
          method: method
        };

        // was seeing duplicate http network requests on the wire when the params were diff
        // and quick sequential calls were made eventhough the httpConfig.params were diff via debugger
        // tracked the issue to some referencing issue which was resolved by cloning the params

        if (method === "GET") {
          httpConfig.params = JSON.parse(JSON.stringify(params));
        } else {
          httpConfig.data = JSON.parse(JSON.stringify(params));
        }

        return $http(httpConfig).then(function successCallback(fulfilled) {

          $log.debug(apiDataType, fulfilled);
          return fulfilled.data;

        }).catch(function (err) {

          $log.error(apiDataType, err);
          throw err;

        });

      };

      return service;
    }
);
