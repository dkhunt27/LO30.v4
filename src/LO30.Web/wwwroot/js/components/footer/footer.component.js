'use strict';

angular.module('lo30NgApp')
  .component('footerComponent', {
    bindings: {
    },
    templateUrl: 'js/components/footer/footer.html',
    controller: function ($scope, screenSize) {
      var vm = this;

      vm.footerMobile = false;

      if (screenSize.is('xs, sm')) {

        vm.footerMobile = true;

      }
    }
  });
