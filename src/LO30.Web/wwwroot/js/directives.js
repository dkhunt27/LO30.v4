'use strict';

//Directive used to set metisMenu and minimalize button
angular.module('lo30NgApp')
    .directive('sideNavigation', function ($timeout) {
      return {
        restrict: 'A',
        link: function (scope, element) {
          // Call metsi to build when user signup
          scope.$watch('authentication.user', function () {
            $timeout(function () {
              element.metisMenu();
            });
          });

        }
      };
    })
    .directive('minimalizaSidebar', function ($timeout) {
      return {
        restrict: 'A',
        template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
        controller: function ($scope) {
          $scope.minimalize = function () {
            angular.element('body').toggleClass('mini-navbar');
            if (!angular.element('body').hasClass('mini-navbar') || angular.element('body').hasClass('body-small')) {
              // Hide menu in order to smoothly turn on when maximize menu
              angular.element('#side-menu').hide();
              // For smoothly turn on menu
              $timeout(function () {
                angular.element('#side-menu').fadeIn(400);
              }, 200);
            } else {
              // Remove all inline style from jquery fadeIn function to reset menu state
              angular.element('#side-menu').removeAttr('style');
            }
          };
        }
      };
    })
    .directive('pageTitle', function ($state) {
      return {
        restrict: 'E',
        template: '<h4>{{pageTitle}}abc</h4>',
        link: function (scope, element, attrs) {

          scope.$watch('stateData', function (value) {
            scope.pageTitle = value.pageTitle;
          }, true);

          scope.stateData = $state.current.data;
        }
      };
    });


