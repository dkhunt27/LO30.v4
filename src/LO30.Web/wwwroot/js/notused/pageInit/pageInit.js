'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.directive('lo30PageInit',
  [
    function (eehNavigationSidebar) {
      return {
        restrict: 'E',
        scope: {
        },
        link: function (scope, elem, attrs) {

          scope.$watch('$viewContentLoaded', function () {
            $('.eeh-navigation-sidebar').addClass('sidebar-text-collapsed')
          });

          eehNavigationSidebar.sidebarIsCollapsed

          /*var width = $(this).width();

          if (width <= 800) {
            $('.eeh-navigation-sidebar').addClass('sidebar-text-collapsed')
          } else if (width <= 1200) {
            $('.eeh-navigation-sidebar').addClass('sidebar-text-collapsed')
          } else {
            $('.eeh-navigation-sidebar').removeClass('sidebar-text-collapsed')
          }*/

        }
      };
    }
  ]
);

