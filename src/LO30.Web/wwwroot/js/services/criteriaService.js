'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.factory("criteriaService",
  function ($log, $q, seasonId, seasonTypeId) {

    var service = {};

    service.seasonId = {
      get: function () {

        return seasonId;

      }
    }

    service.seasonTypeId = {
      get: function () {

        return seasonTypeId;
      
      }
    }

    return service;
  }
);
