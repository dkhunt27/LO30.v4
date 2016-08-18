'use strict';

angular.module('lo30NgApp')
  .component('navigationComponent', {
    bindings: {
    },
    templateUrl: 'js/components/navigation/navigation.html',
    controller: function ($scope, criteriaService, broadcastService) {
      var vm = this;

      vm.activePage = "notset";

      vm.setActive = function (activePage) {
        vm.activePage = activePage;
      };

      vm.isActive = function (page) {
        return vm.activePage === page;
      };

      vm.season = criteriaService.seasons.get();
      vm.seasonType = criteriaService.seasonTypes.get();

      $scope.$on(broadcastService.events().seasonSet, function () {

        vm.season = criteriaService.seasons.get();

      });

      $scope.$on(broadcastService.events().seasonTypeSet, function () {

        vm.seasonType = criteriaService.seasonTypes.get();

      });
    }
  });
