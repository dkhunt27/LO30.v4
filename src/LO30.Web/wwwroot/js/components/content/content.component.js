'use strict';

angular.module('lo30NgApp')
  .component('contentComponent', {
    bindings: {
    },
    templateUrl: 'js/components/content/content.html',
    controller: function ($scope, $element, $attrs, $state, criteriaService) {
      var vm = this;

      vm.pageTitle = $state.current.data.pageTitle;
    }
  });
