'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.factory("dataServiceTeamRosters",
  [
    "constApisUrl",
    "$resource",
    function (constApisUrl, $resource) {

      var resourceTeamRosters = $resource(constApisUrl + '/teamRosters');
      var resourceTeamRostersByTeamIdAndYYYYMMDD = $resource(constApisUrl + '/teamRosters/:teamId/:yyyymmdd', { teamId: '@teamId', yyyymmdd: '@yyyymmdd' });
      var resourceTeamRosterByTeamIdPlayerIdAndYYYYMMDD = $resource(constApisUrl + '/teamRoster/:teamId/:yyyymmdd/:playerId', { teamId: '@teamId', yyyymmdd: '@yyyymmdd', playerId: '@playerId' });

      var listTeamRosters = function () {
        return resourceTeamRosters.query();
      };

      var listTeamRostersByTeamIdAndYYYYMMDD = function (teamId, yyyymmdd) {
        return resourceTeamRostersByTeamIdAndYYYYMMDD.query({ teamId: teamId, yyyymmdd: yyyymmdd });
      };
      
      var getTeamRosterByTeamIdYYYYMMDDAndPlayerId = function (teamId, yyyymmdd, playerId) {
        return resourceTeamRosterByTeamIdYYYYMMDDAndPlayerId.get({ teamId: teamId, yyyymmdd: yyyymmdd, playerId: playerId });
      };

      return {
        listTeamRosters: listTeamRosters,
        listTeamRostersByTeamIdAndYYYYMMDD: listTeamRostersByTeamIdAndYYYYMMDD,
        getTeamRosterByTeamIdYYYYMMDDAndPlayerId: getTeamRosterByTeamIdYYYYMMDDAndPlayerId
      };
    }
  ]
);

