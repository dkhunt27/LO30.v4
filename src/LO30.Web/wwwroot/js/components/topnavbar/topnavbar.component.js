'use strict';

angular.module('lo30NgApp')
  .component('topnavbarComponent', {
    bindings: {
      pageTitle: "<"
    },
    templateUrl: 'js/components/topnavbar/topnavbar.html',
    controller: function ($scope, $element, $attrs, $state) {
      var vm = this;

      vm.$onInit = function () {
        vm.pageTitle2 = $state.current.data.pageTitle;
      };

      vm.$onInit = function () {
        vm.pageTitle2 = $state.current.data.pageTitle;
      };
    }
  });
