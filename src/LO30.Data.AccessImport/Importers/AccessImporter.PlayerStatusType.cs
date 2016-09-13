using LO30.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace LO30.Data.AccessImport.Importers
{
  public partial class AccessImporter
  {
    public ImportStat ImportPlayerStatusTypes()
    {
      string table = "PlayerStatusTypes";
      var iStat = new ImportStat(_logger, table);

      if (_loadNewData || (_seed && _context.PlayerStatusTypes.Count() == 0))
      {
        _logger.Write("Importing " + table);

        using (var transaction = _context.Database.BeginTransaction())
        {
          _context.Database.ExecuteSqlCommand("SET IDENTITY_INSERT " + table + " ON");

          dynamic parsedJson = _jsonFileService.ParseObjectFromJsonFile(_folderPath + "Statuses.json");
          int count = parsedJson.Count;

          _logger.Write("Access records to process:" + count);

          for (var d = 0; d < parsedJson.Count; d++)
          {
            if (d % 100 == 0) { _logger.Write("Access records processed:" + d); }
            var json = parsedJson[d];

            var playerStatusType = new PlayerStatusType()
            {
              PlayerStatusTypeId = json["STATUS_ID"],
              PlayerStatusTypeName = json["STATUS_DESC"]
            };

            _context.PlayerStatusTypes.Add(playerStatusType);
          }

          _lo30ContextService.ContextSaveChanges();
          iStat.Imported();

          ContextSaveChanges();

          _context.Database.ExecuteSqlCommand("SET IDENTITY_INSERT " + table + " OFF");

          transaction.Commit();
        }
        iStat.Saved(_context.PlayerStatusTypes.Count());
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