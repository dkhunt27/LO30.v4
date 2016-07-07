'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.directive('lo30SlimScroll',
  [
    function () {
      return {
        restrict: 'A',
        scope: {
          boxHeight: '@'
        },
        link: function (scope, element) {
          $timeout(function () {
            element.slimscroll({
              height: scope.boxHeight,
              railOpacity: 0.9
            });

          });
        }
      };
    }
  ]
);

