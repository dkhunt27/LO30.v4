'use strict';

angular.module('lo30NgApp')
  .filter('filterize', function (screenSize) {

  var processIntoFilters = function(filterOn) {
    var filters = [];

    var filterOnFilters = filterOn.split(',');

    angular.forEach(filterOnFilters, function (filterOnFilter) {
      var filterOnFilterParts = filterOnFilter.split(':');
      if (filterOnFilterParts.length === 0 || !filterOnFilterParts[1]) {
        // this is text only filter
        filters.push({key:"TEXTONLY", value:filterOnFilterParts})
      } else {

        var filterOnKey = filterOnFilterParts[0].replace(/(^\s+|\s+$)/g, '');  // remove any space that would be with comma
        var filterOnValue = filterOnFilterParts[1].toLowerCase();

        var filterKeyMapped;
        // map filter keys from columns to object
        switch (filterOnKey.toLowerCase()) {
          case "rank":
            filterKeyMapped = "ranking";
            break;
          case "team":
            if (screenSize.is('xs, sm')) {
              filterKeyMapped = "teamCode";
            } else {
              filterKeyMapped = "teamNameShort";
            }
            break;
          case "player":
            filterKeyMapped = "player";
            break;
          case "pos":
          case "position":
            filterKeyMapped = "position";
            break;
          case "line":
            filterKeyMapped = "line";
            break;
          case "sub":
            filterKeyMapped = "sub";
            break;
          default:
        }

        filters.push({key:filterKeyMapped, value:filterOnValue})
      }
    });

    return filters;
  };

  return function (items, filterOn) {
    if (!filterOn) {
      return items;
    } else {
      var filters = processIntoFilters(filterOn);
      var filtered = [];
      angular.forEach(items, function (item) {
        var matchedItem = []

        angular.forEach(filters, function (filter) {
          if (filter.key === "TEXTONLY") {
            if (JSON.stringify(item).toLowerCase().indexOf(filter.value) !== -1) {
              matchedItem.push(item);
            }
          } else {
            var propValue = item[filter.key];
            if (propValue) {

              if (typeof propValue !== "string") {
                propValue = JSON.stringify(propValue);
              }

              if (propValue.toLowerCase().indexOf(filter.value) !== -1) {
                matchedItem.push(item);
              }
            }
          }
        });

        // now if the matchedItem length === filters length...then it matched on all the filters, so keep it
        if (matchedItem.length === filters.length) {
          filtered.push(item);
        }
      });
    }
    return filtered;
  };
});