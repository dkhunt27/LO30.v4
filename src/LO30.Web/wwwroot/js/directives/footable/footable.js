'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.directive('lo30Footable',
  [
    function ($compile) {
      return {
        link: {
          post: function (scope, element) {
            //http://stackoverflow.com/questions/20243339/footable-along-with-angular-js

            if (!scope.$last) {
              return false;
            }

            var footableTable = element.parents('table');

            scope.$evalAsync(function () {

              if (!footableTable.hasClass('footable-loaded')) {
                footableTable.footable();
              }

              footableTable.data('__FooTable__').draw();

              $compile(element.contents())(scope);
            });
          }
        },
        pre: function postLink(scope, element) {
          $compile(element.contents())(scope);
        }
      }
    }
  ]
);

