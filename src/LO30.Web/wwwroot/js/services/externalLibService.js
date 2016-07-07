'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.factory(
  'externalLibService',
  [
    function () {

      /* global _, sjv, moment */

      var _temp = _;
      var sjvtemp = sjv;
      var momenttemp = moment;

      return {
        _: _temp,
        sjv: sjvtemp,
        moment: momenttemp
      };
    }
  ]
);