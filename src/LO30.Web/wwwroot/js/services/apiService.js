'use strict';

/* jshint -W117 */ //(remove the undefined warning)
lo30NgApp.factory("apiService",
    function (externalLibService, apiBaseService) {

      var _ = externalLibService._;

      var service = {
        dataProcessing: {},
        games: {},
        goalieStatGames: {},
        playerStatCareers: {},
        playerStatGames: {},
        playerStatSeasons: {},
        playerStatTeams: {},
        scoreSheetEntryProcessedGoals: {},
        scoreSheetEntryProcessedPenalties: {},
        seasons: {},
        teamStandings: {}
      };

      service.dataProcessing.getLastGameProcessedForSeasonId = function (seasonId) {
        var inputs = {
          apiDataType: "dataProcessing.getLastGameProcessedForSeasonId",
          urlPartial: "dataprocessing/lastprocessedgameid/seasons/" + seasonId,
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs);
      }

      service.games.getForGameId = function (gameId) {
        var inputs = {
          apiDataType: "games.getForGameId",
          urlPartial: "games/" + gameId,
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs);
      }

      service.games.listForSeasonIdTeamId = function (seasonId, teamId) {
        var inputs = {
          apiDataType: "games.listForSeasonIdTeamId",
          urlPartial: "games/seasons/" + seasonId + "/teams/" + teamId,
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs);
      }

      service.games.listForSeasonId = function (seasonId) {
        var inputs = {
          apiDataType: "games.listForSeasonId",
          urlPartial: "games/seasons/" + seasonId,
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs);
      }

      service.goalieStatGames.listForGameId = function (gameId) {
        var inputs = {
          apiDataType: "goalieStatGames.listForGameId",
          urlPartial: "goaliestatgames/games/" + gameId,
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs);
      }

      service.goalieStatGames.listForPlayerIdSeasonId = function (playerId, seasonId) {
        var inputs = {
          apiDataType: "goalieStatGames.listForSeasonIdPlayerId",
          urlPartial: "goaliestatgames/goalies/" + playerId + "/seasons/" + seasonId,
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs);
      }

      service.playerStatCareers.getForPlayerId = function (playerId) {
        var inputs = {
          apiDataType: "playerStatCareers.getForPlayerId",
          urlPartial: "playerstatcareers/players/" + playerId,
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs);
      }

      service.playerStatGames.listForPlayerIdSeasonId = function (playerId, seasonId) {
        var inputs = {
          apiDataType: "playerStatGames.listForSeasonIdPlayerId",
          urlPartial: "playerstatgames/players/" + playerId + "/seasons/" + seasonId,
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs);
      }

      service.playerStatSeasons.listForPlayerId = function (playerId) {
        var inputs = {
          apiDataType: "playerStatSeasons.listForPlayerId",
          urlPartial: "playerstatseasons/players/" + playerId,
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs);
      }

      service.playerStatSeasons.listForPlayerIdSeasonId = function (playerId, seasonId) {
        var inputs = {
          apiDataType: "playerStatSeasons.listForPlayerId",
          urlPartial: "playerstatseasons/players/" + playerId + "/seasons/" + seasonId,
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs);
      }

      service.playerStatTeams.listForSeasonIdPlayoffs = function (seasonId, playoffs) {
        var inputs = {
          apiDataType: "playerStatTeams.listForSeasonIdPlayoffs",
          urlPartial: "playerstatteams/seasons/" + seasonId + "/playoffs/" + playoffs,
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs);
      }

      service.playerStatTeams.listForPlayerIdSeasonId = function (playerId, seasonId) {
        var inputs = {
          apiDataType: "playerStatTeams.listForSeasonIdPlayerId",
          urlPartial: "playerstatteams/players/" + playerId + "/seasons/" + seasonId,
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs);
      }

      service.scoreSheetEntryProcessedGoals.listForGameId = function (gameId) {
        var inputs = {
          apiDataType: "scoreSheetEntryProcessedGoals.listForGameId",
          urlPartial: "scoresheetentries/processed/goals/games/" + gameId,
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs);
      }

      service.scoreSheetEntryProcessedPenalties.listForGameId = function (gameId) {
        var inputs = {
          apiDataType: "scoreSheetEntryProcessedPenalties.listForGameId",
          urlPartial: "scoresheetentries/processed/penalties/games/" + gameId,
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs);
      }

      service.seasons.list = function () {
        var inputs = {
          apiDataType: "seasons.list",
          urlPartial: "seasons",
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs).then(function (fulfilled) {
          return _.reject(fulfilled, function (item) { return item.seasonId === -1; })
        });
      }

      service.seasons.listForSeasonsWithGameSelection = function () {
        var inputs = {
          apiDataType: "seasons.list",
          urlPartial: "seasons",
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs).then(function (fulfilled) {
          return _.filter(fulfilled, function (item) { return item.seasonId >= 43; })
        });
      }

      service.teamStandings.listForSeasonIdPlayoffs = function (seasonId, playoffs) {
        var inputs = {
          apiDataType: "teamStandings.listForSeasonIdPlayoffs",
          urlPartial: "teamstandings/seasons/" + seasonId + "/playoffs/" + playoffs,
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs);
      }

      service.teamStandings.listForSeasonIdTeamId = function (seasonId, teamId) {
        var inputs = {
          apiDataType: "teamStandings.listForSeasonIdTeamId",
          urlPartial: "teamstandings/seasons/" + seasonId + "/teams/" + teamId,
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs);
      }


      return service;
    }
);
