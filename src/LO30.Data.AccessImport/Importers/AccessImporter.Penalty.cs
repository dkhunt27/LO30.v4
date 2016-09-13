using LO30.Data;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.Linq;

namespace LO30.Data.AccessImport.Importers
{
  public partial class AccessImporter
  {
    public ImportStat ImportPenalties()
    {
      string table = "Penalties";
      var iStat = new ImportStat(_logger, table);

      if (_loadNewData || (_seed && _context.Penalties.Count() == 0))
      {
        _logger.Write("Importing " + table);

        using (var transaction = _context.Database.BeginTransaction())
        {
          _context.Database.ExecuteSqlCommand("SET IDENTITY_INSERT " + table + " ON");

          dynamic parsedJson = _jsonFileService.ParseObjectFromJsonFile(Path.Combine(_folderPath, "Penalties.json"));
          int count = parsedJson.Count;

          _logger.Write("Access records to process:" + count);

          for (var d = 0; d < parsedJson.Count; d++)
          {
            if (d % 100 == 0) { _logger.Write("Access records processed:" + d); }
            var json = parsedJson[d];

            var penalty = new Penalty()
            {
              PenaltyId = json["PENALTY_ID"],
              PenaltyCode = json["PENALTY_SHORT_DESC"],
              PenaltyName = json["PENALTY_LONG_DESC"],
              DefaultPenaltyMinutes = json["DEFAULT_PENALTY_MINUTES"],
              StickPenalty = json["STICK_PENALTY"]
            };

            _context.Penalties.Add(penalty);
          }

          iStat.Imported();

          ContextSaveChanges();

          _context.Database.ExecuteSqlCommand("SET IDENTITY_INSERT " + table + " OFF");

          transaction.Commit();
        }
        iStat.Saved(_context.Penalties.Count());
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