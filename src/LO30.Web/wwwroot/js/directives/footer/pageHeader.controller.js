'use strict';

angular.module('lo30NgApp')
  .controller('lo30PageHeaderController',
  [
    '$log',
    '$scope',
    '$state',
    'criteriaService',
    'broadcastService',
    'screenSize',
    function ($log, $scope, $state, criteriaService, broadcastService, screenSize) {

      var vm = this;

      $scope.determineNgClass = function () {

        var ngClass = "";

        if (screenSize.is('xs, sm')) {

          ngClass = "navbar-title";

        } else if (screenSize.is('md')) {

          ngClass = "navbar-title";

        } else {

          ngClass = "navbar-title";

        }

        return ngClass;
      };

      vm.$onInit = function () {

        $scope.pageTitle = $state.current.data.pageTitle;
      };

    }
  ]
);

