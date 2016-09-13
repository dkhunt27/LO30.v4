using LO30.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace LO30.Data.AccessImport.Importers
{
  public partial class AccessImporter
  {
    public ImportStat ImportZzzzzz()
    {
      string table = "Zzzzz";
      var iStat = new ImportStat(_logger, table);

      if (_loadNewData || (_seed && _context.Seasons.Count() == 0))
      {
        _logger.Write("Importing " + table);

        using (var transaction = _context.Database.BeginTransaction())
        {
          _context.Database.ExecuteSqlCommand("SET IDENTITY_INSERT " + table + " ON");

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