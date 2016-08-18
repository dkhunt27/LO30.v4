'use strict';

angular.module('lo30NgApp')
  .filter('percentage',
  [
    '$filter',
    function ($filter) {
      return function (input, decimals) {
        return $filter('number')(input * 100, decimals) + '%';
      };
    }
  ]
);