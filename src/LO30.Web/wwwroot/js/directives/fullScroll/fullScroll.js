'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.directive('lo30FullScroll',
  [
    function () {
      return {
        restrict: 'A',
        link: function (scope, element) {
          $timeout(function () {
            element.slimscroll({
              height: '100%',
              railOpacity: 0.9
            });

          });
        }
      };
    }
  ]
);

