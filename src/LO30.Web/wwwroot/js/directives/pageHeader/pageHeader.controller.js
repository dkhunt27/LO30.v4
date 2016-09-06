'use strict';

angular.module('lo30NgApp')
  .controller('lo30PageHeaderController',
  [
    '$log',
    '$scope',
    '$state',
    'criteriaService',
    'broadcastService',
    function ($log, $scope, $state, criteriaService, broadcastService) {

      var vm = this;

      vm.$onInit = function () {

        $scope.pageTitle = $state.current.data.pageTitle;
      };

    }
  ]
);

