'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.directive('lo30Footable',
  [
    '$compile',
    function ($compile) {
      return function(scope, element){
        var footableTable = element.parents('table');
        if( !scope.$last ) {
          return false;
        }
        scope.$evalAsync(function(){
          if (! footableTable.hasClass('footable-loaded')) {footableTable.footable();
          }footableTable.trigger('footable_initialized');footableTable.trigger('footable_resize');footableTable.data('footable').redraw();
        });
      };
    }
  ]
);

