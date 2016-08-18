'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.directive('lo30DatatablesFilterRowHider',
  [
    function () {
      return {
        restrict: 'E',
        templateUrl: "/views/directives/datatablesFilterRowHider.html",
        scope: {
        },
        link: function (scope, element, attrs, controller) {

          var div = element.parents('div');

          var el = div.find('datatables-filter-row');
           //el.addClass("ng-hide");
        }
      };
    }
  ]
);

