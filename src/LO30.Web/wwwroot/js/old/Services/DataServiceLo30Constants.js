'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.factory("dataServiceLo30Constants",
  [
    function () {

      var currentTeams = [
        "Bill Brown",
        "Hunt's Ace",
        "LAB/PSI",
        "Zas Ent",
        "DPKZ",
        "Villanova",
        "Glover",
        "D&G"
      ];

      var availablePositions = [
        "F",
        "D",
        "G"
      ];

      var subOptions = [
        "With",
        "Without",
      ];

      var availableLines = [
        "1",
        "2",
        "3",
      ];

      var getCurrentTeams = function () {
        return currentTeams;
      };

      var getAvailablePositions = function () {
        return availablePositions;
      };

      var getAvailableLines = function () {
        return availableLines;
      };

      var getSubOptions = function (settings) {
        return subOptions;
      };

      return {
        getCurrentTeams: getCurrentTeams,
        getAvailablePositions: getAvailablePositions,
        getAvailableLines: getAvailableLines,
        getSubOptions: getSubOptions
      };
    }
  ]
);

