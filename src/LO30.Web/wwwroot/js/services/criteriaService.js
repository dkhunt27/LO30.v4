'use strict';

angular.module('lo30NgApp')
  .factory("criteriaService", function ($log, $q, externalLibService, broadcastService) {

    var _ = externalLibService._;

    var seasons = [
        { "seasonId": 56, "seasonName": "2015 - 2016" },
        { "seasonId": 54, "seasonName": "2014 - 2015" },
        { "seasonId": 53, "seasonName": "2013 - 2014" },
        { "seasonId": 52, "seasonName": "2012 - 2013" },
        { "seasonId": 51, "seasonName": "2011 - 2012" },
        { "seasonId": 50, "seasonName": "2010 - 2011" },
        { "seasonId": 49, "seasonName": "2009 - 2010" },
        { "seasonId": 48, "seasonName": "2008 - 2009" },
        { "seasonId": 47, "seasonName": "2007 - 2008" },
        { "seasonId": 46, "seasonName": "2006 - 2007" },
        { "seasonId": 45, "seasonName": "2005 - 2006" },
        { "seasonId": 44, "seasonName": "2004 - 2005" },
        { "seasonId": 43, "seasonName": "2003 - 2004" },
        { "seasonId": 42, "seasonName": "2002 - 2003" },
        { "seasonId": 41, "seasonName": "2001 - 2002" },
        { "seasonId": 40, "seasonName": "2000 - 2001" }
    ];

    var decades = [
      { "decadeId": 4, "decadeName": "2010-2019", "seasons": [56, 54, 53, 52, 51, 50] },
      { "decadeId": 3, "decadeName": "2000-2009", "seasons": [49, 48, 47, 46, 45, 44, 43, 42, 41, 40] }
      //{ "decadeId": 2, "decadeName": "1990-1999", "seasons": [] },
      //{ "decadeId": 1, "decadeName": "1980-1989", "seasons": [] },
      //{ "decadeId": 0, "decadeName": "1970-1979", "seasons": [] }
    ];

    var seasonTypes = [
      { seasonTypeId: 0, seasonTypeName: "Regular Season" },
      { seasonTypeId: 1, seasonTypeName: "Playoffs" }
    ];

    // set the defaults
    var selectedSeasonId = 56;
    var selectedSeasonTypeId = 0;

    var service = {};

    service.decades = {
      get: function () {
        return decades.map(function (decade) {

          decade.hasSelectedSeason = false;

          decade.seasons = decade.seasons.map(function (item) {

            var season;

            // find the season
            // iniitally the seasons will be a list of integers, so will need to look them up
            // however, after initial load, the list will be the seasons...but will need to reset selected

            if (typeof item === "object") {
              season = item;
            } else {
              season = _.findWhere(seasons, { seasonId: item });
            }

            if (season.seasonId === selectedSeasonId) {
              season.isSelectedSeason = true;
              decade.hasSelectedSeason = true;
            } else {
              season.isSelectedSeason = false;
            }

            return season;
          });

          return decade;
        });
      }
    }

    service.seasons = {
      get: function () {

        return _.findWhere(seasons, { seasonId: selectedSeasonId });;

      },
      set: function (season) {

        if (season.seasonId !== selectedSeasonId) {

          selectedSeasonId = season.seasonId;

          broadcastService.emitEvent(broadcastService.events().seasonSet);
        }
      },
      setById: function (seasonId) {

        seasonId = parseInt(seasonId, 10);

        if (seasonId !== selectedSeasonId) {

          selectedSeasonId = parseInt(seasonId, 10);

          broadcastService.emitEvent(broadcastService.events().seasonSet);
        }
      }
    }

    service.seasonTypes = {
      get: function () {

        return _.findWhere(seasonTypes, { seasonTypeId: selectedSeasonTypeId });;

      },
      set: function (seasonType) {

        if (seasonType.seasonTypeId !== selectedSeasonTypeId) {

          selectedSeasonTypeId = seasonType.seasonTypeId;

          broadcastService.emitEvent(broadcastService.events().seasonTypeSet);
        }
      },
      setById: function (seasonTypeId) {

        seasonTypeId = parseInt(seasonTypeId, 10);

        if (seasonTypeId !== selectedSeasonTypeId) {

          selectedSeasonTypeId = seasonTypeId;

          broadcastService.emitEvent(broadcastService.events().seasonTypeSet);
        }
      }
    }

    return service;
  }
);
