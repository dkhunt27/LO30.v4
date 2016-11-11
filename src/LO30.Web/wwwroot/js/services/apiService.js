﻿'use strict';

angular.module('lo30NgApp')
  .factory("apiService",
    function (externalLibService, apiBaseService) {

      var _ = externalLibService._;

      var service = {
        dataProcessing: {},
        games: {},
        gameRosters: {},
        gameTeams: {},
        goalieStatCareers: {},
        goalieStatGames: {},
        goalieStatSeasons: {},
        goalieStatTeams: {},
        lineStatGames: {},
        lineStatSeasons: {},
        lineStatTeams: {},
        players: {},
        playerStatCareers: {},
        playerStatGames: {},
        playerStatSeasons: {},
        playerStatTeams: {},
        scoreSheetEntryGoals: {},
        scoreSheetEntryPenalties: {},
        scoreSheetEntrySubs: {},
        scoreSheetEntryProcessedGoals: {},
        scoreSheetEntryProcessedPenalties: {},
        scoreSheetEntryProcessedSubs: {},
        seasons: {},
        teams: {},
        teamRosters: {},
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

      service.gameRosters.listForGameId = function (gameId) {
        var inputs = {
          apiDataType: "gameRosters.listForGameId",
          urlPartial: "gamerosters/games/" + gameId,
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs);
      }

      service.gameTeams.listForGameId = function (gameId) {
        var inputs = {
          apiDataType: "gameTeams.listForGameId",
          urlPartial: "gameteams/games/" + gameId,
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs);
      }

      service.goalieStatCareers.list = function (playerId) {
        var inputs = {
          apiDataType: "goalieStatCareers.list",
          urlPartial: "goaliestatcareers",
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs);
      }

      service.goalieStatCareers.getForPlayerId = function (playerId) {
        var inputs = {
          apiDataType: "goalieStatCareers.getForPlayerId",
          urlPartial: "goaliestatcareers/players/" + playerId,
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs);
      }

      service.goalieStatSeasons.listForPlayerId = function (playerId) {
        var inputs = {
          apiDataType: "goalieStatSeasons.listForPlayerId",
          urlPartial: "goaliestatseasons/players/" + playerId,
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs);
      }

      service.goalieStatSeasons.listForPlayerIdSeasonId = function (playerId, seasonId) {
        var inputs = {
          apiDataType: "goalieStatSeasons.listForPlayerId",
          urlPartial: "goaliestatseasons/players/" + playerId + "/seasons/" + seasonId,
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs);
      }

      service.goalieStatTeams.listForSeasonIdSeasonTypeId = function (seasonId, seasonTypeId) {
        var inputs = {
          apiDataType: "goalieStatTeams.listForSeasonIdSeasonTypeId",
          urlPartial: "goaliestatteams/seasons/" + seasonId + "/seasonTypes/" + seasonTypeId,
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs);
      }

      service.goalieStatTeams.listForPlayerIdSeasonId = function (playerId, seasonId) {
        var inputs = {
          apiDataType: "goalieStatTeams.listForSeasonIdPlayerId",
          urlPartial: "goaliestatteams/players/" + playerId + "/seasons/" + seasonId,
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

      service.lineStatSeasons.listForSeasonIdSeasonTypeId = function (seasonId, seasonTypeId) {
        var inputs = {
          apiDataType: "lineStatSeasons.listForSeasonIdSeasonTypeId",
          urlPartial: "linestatseasons/seasons/" + seasonId + "/seasonTypes/" + seasonTypeId,
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs);
      }

      service.lineStatSeasons.ListForTeamIdSeasonId = function (teamId, seasonId) {
        var inputs = {
          apiDataType: "lineStatSeasons.ListForTeamIdSeasonId",
          urlPartial: "linestatseasons/teams/" + teamId + "/seasons/" + seasonId,
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs);
      }

      service.lineStatTeams.listForSeasonIdSeasonTypeId = function (seasonId, seasonTypeId) {
        var inputs = {
          apiDataType: "lineStatTeams.listForSeasonIdSeasonTypeId",
          urlPartial: "linestatteams/seasons/" + seasonId + "/seasonTypes/" + seasonTypeId,
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs);
      }

      service.lineStatTeams.ListForTeamIdSeasonId = function (teamId, seasonId) {
        var inputs = {
          apiDataType: "lineStatTeams.ListForTeamIdSeasonId",
          urlPartial: "linestatteams/teams/" + teamId + "/seasons/" + seasonId,
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs);
      }

      service.lineStatGames.listForGameId = function (gameId) {
        var inputs = {
          apiDataType: "lineStatGames.listForGameId",
          urlPartial: "linestatgames/games/" + gameId,
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs);
      }

      service.lineStatGames.ListForTeamIdLineSeasonId = function (teamId, line, seasonId) {
        var inputs = {
          apiDataType: "lineStatGames.ListForTeamIdLineSeasonId",
          urlPartial: "linestatgames/teams/" + teamId + "/lines/" + line + "/seasonTypes/" + seasonId,
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs);
      }

      service.players.list = function () {
        var inputs = {
          apiDataType: "games.list",
          urlPartial: "players",
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs);
      }

      service.playerStatCareers.list = function () {
        var inputs = {
          apiDataType: "playerStatCareers.list",
          urlPartial: "playerstatcareers",
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

      service.playerStatTeams.listForSeasonIdSeasonTypeId = function (seasonId, seasonTypeId) {
        var inputs = {
          apiDataType: "playerStatTeams.listForSeasonIdSeasonTypeId",
          urlPartial: "playerstatteams/seasons/" + seasonId + "/seasonTypes/" + seasonTypeId + "?key=1",
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs);
      }

      service.playerStatTeams.filterListForSeasonIdSeasonTypeId = function (seasonId, seasonTypeId, filters) {
        var inputs = {
          apiDataType: "playerStatTeams.listForSeasonIdSeasonTypeId",
          urlPartial: "playerstatteams/seasons/" + seasonId + "/seasonTypes/" + seasonTypeId + "?" + filters,
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

      service.scoreSheetEntryGoals.listForGameId = function (gameId) {
        var inputs = {
          apiDataType: "scoreSheetEntryGoals.listForGameId",
          urlPartial: "scoresheetentries/goals/games/" + gameId,
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs);
      }

      service.scoreSheetEntryPenalties.listForGameId = function (gameId) {
        var inputs = {
          apiDataType: "scoreSheetEntryPenalties.listForGameId",
          urlPartial: "scoresheetentries/penalties/games/" + gameId,
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs);
      }

      service.scoreSheetEntrySubs.listForGameId = function (gameId) {
        var inputs = {
          apiDataType: "scoreSheetEntrySubs.listForGameId",
          urlPartial: "scoresheetentries/subs/games/" + gameId,
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

      service.scoreSheetEntryProcessedSubs.listForGameId = function (gameId) {
        var inputs = {
          apiDataType: "scoreSheetEntryProcessedSubs.listForGameId",
          urlPartial: "scoresheetentries/processed/subs/games/" + gameId,
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
      
      service.teams.listForSeasonId = function (seasonId) {
        var inputs = {
          apiDataType: "teams.listForSeasonId",
          urlPartial: "teams/seasons/" + seasonId,
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs);
      }

      service.teamRosters.listForTeamId = function (teamId) {
        var inputs = {
          apiDataType: "teamRosters.listForTeamId",
          urlPartial: "teamrosters/teams/" + teamId,
          method: "GET",
          params: null
        }
        return apiBaseService.execute(inputs);
      }

      service.teamStandings.listForSeasonIdSeasonTypeId = function (seasonId, seasonTypeId) {
        var inputs = {
          apiDataType: "teamStandings.listForSeasonIdSeasonTypeId",
          urlPartial: "teamstandings/seasons/" + seasonId + "/seasonTypes/" + seasonTypeId,
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
