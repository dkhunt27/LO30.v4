'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.directive('lo30ClickStopPropagation',
  [
    function () {
      return {
        restrict: 'A',
        link: function (scope, element) {
          element.bind('click', function (event) {
            event.stopPropagation();
          });
        }
      };
    }
  ]
);

