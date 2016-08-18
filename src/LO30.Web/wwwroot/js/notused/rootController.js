'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.controller('rootController',
    function ($scope, $state, $stateParams, $timeout, $document, screenSize, externalLibService, returnUrlService) {

      var _ = externalLibService._;

      $scope.initializeScopeVariables = function () {

        $scope.local = {
          screenSizeIsDesktop: false,
          screenSizeIsTablet: false,
          screenSizeIsMobile: false,
          sidebarIsCollapsed: false,
          showNavSideBar: true
        };
      };

      $scope.setWatches = function () {
      };

      $scope.setNavToSideMenu = function () {
        var contentWrapper = $document[0].querySelector('#contentWrapper');

      }

      $scope.setReturnUrlForCriteriaSelector = function () {

        var currentUrl = $state.href($state.current.name, $state.params, { absolute: false });

        returnUrlService.set(currentUrl);

      };

      $scope.activate = function () {

        $scope.initializeScopeVariables();

        $scope.setWatches();

        $scope.setReturnUrlForCriteriaSelector();

        $scope.local.screenSizeIsDesktop = screenSize.is('lg');
        $scope.local.screenSizeIsTablet = screenSize.is('md');
        $scope.local.screenSizeIsMobile = screenSize.is('xs, sm');

        if ($scope.local.screenSizeIsMobile) {

          $scope.local.sidebarIsCollapsed = true;
          $scope.local.showNavSideBar = false;

        } else if ($scope.local.screenSizeIsTablet) {

          $scope.local.sidebarIsCollapsed = true;
          $scope.local.showNavSideBar = false;

        } else {

          $scope.local.sidebarIsCollapsed = false;
          $scope.local.showNavSideBar = false;

        }
      };

      $scope.activate();
    }
);