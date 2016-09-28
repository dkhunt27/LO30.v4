'use strict';

angular.module('lo30NgApp')
  .controller('crudScoreSheetEntrySubsController', function (modalWindowFactory) {
    var vm = this;

    //// ---------------- PUBLIC ----------------
    //// PUBLIC fields
    vm.gridController = {};

    //// PUBLIC Methods
    // Method executed when a button inside the grid is clicked
    vm.gridOnButtonClick = _gridOnButtonClick;

    // Method executed when the grid is initialized
    vm.gridOnInitialized = _gridOnInitialized;

    // API URL
    vm.serverUrl = "api/crud/scoreSheetEntrySubs";

    //// ---------------- CODE TO RUN -----------

    //// ---------------- PRIVATE ---------------
    //// PRIVATE fields

    //// PRIVATE Functions - Public Methods Implementation	
    function _gridOnInitialized(controller) {
      vm.gridController = controller;
    }

    function _gridOnButtonClick(sender, args) {
      console.log("button click" + args.button + " " + args.item.id);

      if (args.button === 'plus') {
        modalWindowFactory.show(args.item.name, "Custom button click = +");
      }
      else if (args.button === 'minus') {
        modalWindowFactory.show(args.item.name, "Custom button click = -");
      }
    }
  }
);