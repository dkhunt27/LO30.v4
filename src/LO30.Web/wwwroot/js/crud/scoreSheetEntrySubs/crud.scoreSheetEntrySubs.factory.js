'use strict';

angular.module('lo30NgApp')
  .factory('crudScoreSheetEntrySubsFactory', function itemsFactory(ajaxServiceFactory) {
    return ajaxServiceFactory.getService('api/crud/scoreSheetEntrySubs');
  }
);