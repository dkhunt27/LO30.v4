'use strict';

angular.module('lo30NgApp')
  .factory('crudPlayersFactory', function itemsFactory(ajaxServiceFactory) {
    return ajaxServiceFactory.getService('api/crud/players');
  }
);