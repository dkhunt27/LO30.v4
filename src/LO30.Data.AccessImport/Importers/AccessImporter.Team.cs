using LO30.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace LO30.Data.AccessImport.Importers
{
  public partial class AccessImporter
  {
    public ImportStat ImportTeams(int startingSeasonIdToProcess = 0, int endingSeasonIdToProcess = 99999999)
    {
      string table = "Teams";
      var iStat = new ImportStat(_logger, table);

      if (_loadNewData || (_seed && _context.Teams.Count() == 0))
      {
        _logger.Write("Importing " + table);

        using (var transaction = _context.Database.BeginTransaction())
        {
          _context.Database.ExecuteSqlCommand("SET IDENTITY_INSERT " + table + " ON");

          Team team;
          var divisionIdPlaceholder = 1;

          #region add position night teams
          //var seasonIdPlaceholder = -1;
          //team = new Team()
          //{
          //  SeasonId = seasonIdPlaceholder,
          //  TeamId = -1,
          //  TeamCode = "1TH",
          //  TeamNameShort = "1st Place",
          //  TeamNameLong = "1st Place Team Placeholder",
          //  DivisionId = divisionIdPlaceholder
          //};
          //_context.Teams.Add(team);
          //team = new Team()
          //{
          //  SeasonId = seasonIdPlaceholder,
          //  TeamId = -2,
          //  TeamCode = "2TH",
          //  TeamNameShort = "2nd Place",
          //  TeamNameLong = "2nd Place Team Placeholder",
          //  DivisionId = divisionIdPlaceholder
          //};
          //_context.Teams.Add(team);
          //team = new Team()
          //{
          //  SeasonId = seasonIdPlaceholder,
          //  TeamId = -3,
          //  TeamCode = "3TH",
          //  TeamNameShort = "3rd Place",
          //  TeamNameLong = "3rd Place Team Placeholder",
          //  DivisionId = divisionIdPlaceholder
          //};
          //_context.Teams.Add(team);
          //team = new Team()
          //{
          //  SeasonId = seasonIdPlaceholder,
          //  TeamId = -4,
          //  TeamCode = "4TH",
          //  TeamNameShort = "4th Place",
          //  TeamNameLong = "4th Place Team Placeholder",
          //  DivisionId = divisionIdPlaceholder
          //};
          //_context.Teams.Add(team);
          //team = new Team()
          //{
          //  SeasonId = seasonIdPlaceholder,
          //  TeamId = -5,
          //  TeamCode = "5TH",
          //  TeamNameShort = "5th Place",
          //  TeamNameLong = "5th Place Team Placeholder",
          //  DivisionId = divisionIdPlaceholder
          //};
          //_context.Teams.Add(team);
          //team = new Team()
          //{
          //  SeasonId = seasonIdPlaceholder,
          //  TeamId = -6,
          //  TeamCode = "6TH",
          //  TeamNameShort = "6th Place",
          //  TeamNameLong = "6th Place Team Placeholder",
          //  DivisionId = divisionIdPlaceholder
          //};
          //_context.Teams.Add(team);
          //team = new Team()
          //{
          //  SeasonId = seasonIdPlaceholder,
          //  TeamId = -7,
          //  TeamCode = "7TH",
          //  TeamNameShort = "7th Place",
          //  TeamNameLong = "7th Place Team Placeholder",
          //  DivisionId = divisionIdPlaceholder
          //};
          //_context.Teams.Add(team);
          //team = new Team()
          //{
          //  SeasonId = seasonIdPlaceholder,
          //  TeamId = -8,
          //  TeamCode = "8TH",
          //  TeamNameShort = "8th Place",
          //  TeamNameLong = "8th Place Team Placeholder",
          //  DivisionId = divisionIdPlaceholder
          //};
          //_context.Teams.Add(team);
          //team = new Team()
          //{
          //  SeasonId = seasonIdPlaceholder,
          //  TeamId = -9,
          //  TeamCode = "9TH",
          //  TeamNameShort = "9th Place",
          //  TeamNameLong = "9th Place Team Placeholder",
          //  DivisionId = divisionIdPlaceholder
          //};
          //_context.Teams.Add(team);
          //team = new Team()
          //{
          //  SeasonId = seasonIdPlaceholder,
          //  TeamId = -10,
          //  TeamCode = "10TH",
          //  TeamNameShort = "10th Place",
          //  TeamNameLong = "10th Place Team Placeholder",
          //  DivisionId = divisionIdPlaceholder
          //};
          //_context.Teams.Add(team);
          //team = new Team()
          //{
          //  SeasonId = seasonIdPlaceholder,
          //  TeamId = -11,
          //  TeamCode = "11TH",
          //  TeamNameShort = "11th Place",
          //  TeamNameLong = "11th Place Team Placeholder",
          //  DivisionId = divisionIdPlaceholder
          //};
          //_context.Teams.Add(team);
          //team = new Team()
          //{
          //  SeasonId = seasonIdPlaceholder,
          //  TeamId = -12,
          //  TeamCode = "12TH",
          //  TeamNameShort = "12th Place",
          //  TeamNameLong = "12th Place Team Placeholder",
          //  DivisionId = divisionIdPlaceholder
          //};
          //_context.Teams.Add(team);
          //team = new Team()
          //{
          //  SeasonId = seasonIdPlaceholder,
          //  TeamId = -13,
          //  TeamCode = "13TH",
          //  TeamNameShort = "13th Place",
          //  TeamNameLong = "13th Place Team Placeholder",
          //  DivisionId = divisionIdPlaceholder
          //};
          //_context.Teams.Add(team);
          //team = new Team()
          //{
          //  SeasonId = seasonIdPlaceholder,
          //  TeamId = -14,
          //  TeamCode = "14TH",
          //  TeamNameShort = "14th Place",
          //  TeamNameLong = "14th Place Team Placeholder",
          //  DivisionId = divisionIdPlaceholder
          //};
          //_context.Teams.Add(team);
          //team = new Team()
          //{
          //  SeasonId = seasonIdPlaceholder,
          //  TeamId = -15,
          //  TeamCode = "15TH",
          //  TeamNameShort = "15th Place",
          //  TeamNameLong = "15th Place Team Placeholder",
          //  DivisionId = divisionIdPlaceholder
          //};
          //_context.Teams.Add(team);
          //team = new Team()
          //{
          //  SeasonId = seasonIdPlaceholder,
          //  TeamId = -16,
          //  TeamCode = "16TH",
          //  TeamNameShort = "16th Place",
          //  TeamNameLong = "16th Place Team Placeholder",
          //  DivisionId = divisionIdPlaceholder
          //};
          //_context.Teams.Add(team);
          #endregion

          dynamic parsedJson = _jsonFileService.ParseObjectFromJsonFile(_folderPath + "Teams.json");
          int count = parsedJson.Count;

          _logger.Write("Access records to process:" + count);

          for (var d = 0; d < parsedJson.Count; d++)
          {
            if (d % 100 == 0) { _logger.Write("Access records processed:" + d); }
            var json = parsedJson[d];

            var seasonId = Convert.ToInt32(json["SEASON_ID"]);

            if (seasonId >= startingSeasonIdToProcess && seasonId <= endingSeasonIdToProcess)
            {
              string teamCode = json["TEAM_SHORT_NAME"].ToString();
              if (teamCode.Length > 5)
              {
                teamCode = teamCode.Substring(0, 5);
              }

              string divisionName = json["TEAM_DIVISION_NAME"].ToString();

              var division = _context.Divisions.Where(x => x.DivisionLongName == divisionName).FirstOrDefault();

              int divisionId = divisionIdPlaceholder;
              if (division != null)
              {
                divisionId = division.DivisionId;
              }

              team = new Team()
              {
                SeasonId = Convert.ToInt32(json["SEASON_ID"]),
                TeamId = Convert.ToInt32(json["TEAM_ID"]),
                TeamCode = teamCode,
                TeamNameShort = json["TEAM_SHORT_NAME"].ToString(),
                TeamNameLong = json["TEAM_LONG_NAME"].ToString(),
                DivisionId = divisionId
              };
              _context.Teams.Add(team);
            }
          }

          iStat.Imported();

          ContextSaveChanges();

          _context.Database.ExecuteSqlCommand("SET IDENTITY_INSERT " + table + " OFF");

          transaction.Commit();
        }
        iStat.Saved(_context.Teams.Count());
      }
      else
      {
        _logger.Write(table + " records exist in context; not importing");
        iStat.Imported();
        iStat.Saved(0);
      }

      iStat.Log();

      return iStat;
    }
  }
}