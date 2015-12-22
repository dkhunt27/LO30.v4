'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.directive('lo30Footable',
  [
    function () {
      return function (scope, element) {
        //http://stackoverflow.com/questions/20243339/footable-along-with-angular-js

        var footableTable = element.parents('table');

        if (!scope.$last) {
          return false;
        }

        scope.$evalAsync(function () {

          if (!footableTable.hasClass('footable-loaded')) {
            footableTable.footable();
          }

          //footableTable.trigger('footable_initialized');
          //footableTable.trigger('footable_resize');
          //footableTable.data('footable').redraw();

          footableTable.data('__FooTable__').draw();

        });
      };
    }
  ]
);

