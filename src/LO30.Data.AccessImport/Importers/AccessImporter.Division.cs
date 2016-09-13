using LO30.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace LO30.Data.AccessImport.Importers
{
  public partial class AccessImporter
  {
    public ImportStat ImportDivisions()
    {
      string table = "Divisions";
      var iStat = new ImportStat(_logger, table);

      if (_loadNewData || (_seed && _context.Divisions.Count() == 0))
      {
        _logger.Write("Importing " + table);

        using (var transaction = _context.Database.BeginTransaction())
        {
          _context.Database.ExecuteSqlCommand("SET IDENTITY_INSERT " + table + " ON");

          var division = new Division() { DivisionId = 0, DivisionLongName = "No Division", DivisionShortName = "n/a" };
          int saveOrUpdatedCount = +_lo30ContextService.SaveOrUpdateDivision(division);

          dynamic parsedJson = _jsonFileService.ParseObjectFromJsonFile(_folderPath + "Teams.json");
          int count = parsedJson.Count;

          _logger.Write("Access records to process:" + count);

          for (var d = 0; d < parsedJson.Count; d++)
          {
            if (d % 100 == 0) { _logger.Write("Access records processed:" + d); }
            var json = parsedJson[d];

            string divName = json["TEAM_DIVISION_NAME"];

            if (!string.IsNullOrWhiteSpace(divName))
            {
              var found = _lo30ContextService.FindDivisionByPK2(divName, errorIfNotFound: false, errorIfMoreThanOneFound: true, populateFully: false);
              if (found == null)
              { // only add new divisions
                division = new Division()
                {
                  DivisionLongName = divName,
                  DivisionShortName = "TBD"
                };
                saveOrUpdatedCount = +_lo30ContextService.SaveOrUpdateDivision(division);
              }
            }
          }

          iStat.Imported();

          ContextSaveChanges();

          _context.Database.ExecuteSqlCommand("SET IDENTITY_INSERT " + table + " OFF");

          transaction.Commit();
        }
        iStat.Saved(_context.Divisions.Count());
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