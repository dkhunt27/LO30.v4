'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.factory("dataServiceSettings",
  [
    "constApisUrl",
    "$resource",
    function (constApisUrl, $resource) {

      var resourceSettings = $resource(constApisUrl + '/settings');

      var listSettings = function () {
        return resourceSettings.query();
      };

      var setSettings = function (settings) {
        return resourceSettings.save({}, { settings: settings });
      };

      return {
        listSettings: listSettings,
        setSettings: setSettings
      };
    }
  ]
);

