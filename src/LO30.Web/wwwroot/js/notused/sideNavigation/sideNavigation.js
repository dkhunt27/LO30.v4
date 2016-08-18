'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.directive('lo30SideNavigation',
  [
    '$timeout',
    function ($timeout) {
      return {
        restrict: 'A',
        link: function (scope, element) {
          // Call the metsiMenu plugin and plug it to sidebar navigation
          $timeout(function () {
            element.metisMenu();
          });
        }
      };
    }
  ]
);

