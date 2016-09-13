using LO30.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
namespace LO30.Data.AccessImport.Importers
{
  public partial class AccessImporter
  {
    public ImportStat ImportPlayerStatuses()
    {
      string table = "PlayerStatuses";
      var iStat = new ImportStat(_logger, table);
      int countSaveOrUpdated = 0;

      if (_loadNewData || (_seed && _context.PlayerStatuses.Count() == 0))
      {
        _logger.Write("Importing " + table);

        using (var transaction = _context.Database.BeginTransaction())
        {
          //_context.Database.ExecuteSqlCommand("SET IDENTITY_INSERT " + table + " ON");

          dynamic parsedJson = _jsonFileService.ParseObjectFromJsonFile(_folderPath + "PlayerStatuses.json");
          int count = parsedJson.Count;

          _logger.Write("Access records to process:" + count);

          for (var d = 0; d < parsedJson.Count; d++)
          {
            if (d % 100 == 0) { _logger.Write("Access records processed:" + d); }
            var json = parsedJson[d];

            int playerId = json["PLAYER_ID"];

            if (playerId == 512 || playerId == 545 || playerId == 571 || playerId == 170 || playerId == 211 || playerId == 213 || playerId == 215 || playerId == 217 || playerId == 282 || playerId == 381 || playerId == 426 || playerId == 432 || playerId == 767)
            {
              // do nothing, these guys do not have a player record
            }
            else
            {
              DateTime? eventDate = json["EVENT_DATE"];
              bool currentStatus = json["CURRENT_STATUS_IND"];
              int eventYYYYMMDD = ConvertDateTimeIntoYYYYMMDD(eventDate, ifNullReturnMax: false);

              var playerStatus = new PlayerStatus()
              {
                PlayerId = playerId,
                PlayerStatusTypeId = json["STATUS_ID"],
                EventYYYYMMDD = eventYYYYMMDD,
                CurrentStatus = currentStatus
              };

              countSaveOrUpdated = countSaveOrUpdated + _lo30ContextService.SaveOrUpdatePlayerStatus(playerStatus);
            }
          }

          iStat.Imported();

          ContextSaveChanges();

          //_context.Database.ExecuteSqlCommand("SET IDENTITY_INSERT " + table + " OFF");

          transaction.Commit();
        }
        iStat.Saved(_context.PlayerStatuses.Count());

        _logger.Write("Data Group 3: Updated PlayerStatuses Current " + countSaveOrUpdated);
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