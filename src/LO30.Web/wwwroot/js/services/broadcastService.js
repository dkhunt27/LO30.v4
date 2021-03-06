﻿'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.factory(/* jshint +W117 */
  'broadcastService',
  [
    '$log',
    '$rootScope',
    function ($log, $rootScope) {

      var broadcastService = {};

      var eventList = {
        seasonSet: "seasonSet",
        seasonTypeSet: "seasonTypeSet",
        gameSet: "gameSet"
      };

      var eventListEmitCount = {
        seasonSet: 0,
        seasonTypeSet: 0,
        gameSet: 0
      };

      broadcastService.events = function() {
        return eventList;
      };

      broadcastService.emittedEventsCount = function(event) {
        return eventListEmitCount[event];
      };

      broadcastService.emitEvent = function (event) {
        if (eventList[event]) {
          $log.debug("Broadcast service emitted event: " + event);
          $rootScope.$broadcast(event);
          eventListEmitCount[event] = eventListEmitCount[event] + 1;
        } else {
          $log.error("emitEvent unknown event name: " + event, "broadcastService");
        }
      };

      return broadcastService;
    }
  ]
);
