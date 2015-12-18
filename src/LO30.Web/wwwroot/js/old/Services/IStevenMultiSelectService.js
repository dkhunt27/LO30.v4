'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.factory("istevenMultiSelectService",
  [
    'externalLibService',
    function (externalLibService) {

      var _ = externalLibService._;

      var tickItemInList = function (item, list, field) {

        if (item && list && field) {
          list.forEach(function (listItem) {
            if (item[field] === listItem[field]) {
              listItem.ticked = true;
            }
          });
        }

        return list;
      };

      return {
        tickItemInList: tickItemInList
      };
    }
  ]
);