using LO30.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace LO30.Data.AccessImport.Importers
{
  public partial class AccessImporter
  {
    public ImportStat ImportSeasons(int startingSeasonIdToProcess = 0, int endingSeasonIdToProcess = 99999999)
    {
      string table = "Seasons";
      var iStat = new ImportStat(_logger, table);

      if (_loadNewData || (_seed && _context.Seasons.Count() == 0))
      {
        _logger.Write("Importing " + table);

        using (var transaction = _context.Database.BeginTransaction())
        {
          _context.Database.ExecuteSqlCommand("SET IDENTITY_INSERT " + table + " ON");

          #region add placeholder season
          var seasonIdPlaceholder = -1;
          var season = _lo30ContextService.FindSeason(seasonIdPlaceholder, false, true, false);
          if (season == null)
          {
            season = new Season()
            {
              SeasonId = seasonIdPlaceholder,
              SeasonName = "Placeholder",
              IsCurrentSeason = false,
              StartYYYYMMDD = 0,
              EndYYYYMMDD = 0
            };
            _context.Seasons.Add(season);
          }
          #endregion


          dynamic parsedJson = _jsonFileService.ParseObjectFromJsonFile(_folderPath + "Seasons.json");
          int count = parsedJson.Count;

          _logger.Write("Access records to process:" + count);

          for (var d = 0; d < parsedJson.Count; d++)
          {
            if (d % 100 == 0) { _logger.Write("Access records processed:" + d); }
            var json = parsedJson[d];

            DateTime? startDate = null;
            DateTime? endDate = null;

            if (json["START_DATE"] != null)
            {
              startDate = json["START_DATE"];
            }

            if (json["END_DATE"] != null)
            {
              endDate = json["END_DATE"];
            }

            int seasonId = json["SEASON_ID"];

            if (seasonId >= startingSeasonIdToProcess && seasonId <= endingSeasonIdToProcess)
            {
              if (seasonId == 54)
              {
                startDate = new DateTime(2014, 9, 4);
                endDate = new DateTime(2015, 3, 29);
              }
              else if (seasonId == 56)
              {
                startDate = new DateTime(2015, 9, 10);
                endDate = new DateTime(2016, 3, 27);
              }
              else if (seasonId == 57)
              {
                startDate = new DateTime(2016, 9, 8);
                endDate = new DateTime(2017, 3, 26);
              }

              season = new Season()
              {
                SeasonId = seasonId,
                SeasonName = json["SEASON_NAME"].ToString(),
                IsCurrentSeason = Convert.ToBoolean(json["CURRENT_SEASON_IND"]),
                StartYYYYMMDD = ConvertDateTimeIntoYYYYMMDD(startDate, ifNullReturnMax: false),
                EndYYYYMMDD = ConvertDateTimeIntoYYYYMMDD(endDate, ifNullReturnMax: true)
              };
              _context.Seasons.Add(season);
            }
          }

          iStat.Imported();
          
          ContextSaveChanges();

          _context.Database.ExecuteSqlCommand("SET IDENTITY_INSERT " + table + " OFF");

          transaction.Commit();
        }

        iStat.Saved(_context.Seasons.Count());
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
