using LO30.Data.AccessImport.Services;
using System;

namespace LO30.Data.AccessImport.Importers
{
  public class ImportStat
  {
    string _table;
    int _count;
    DateTime _start = DateTime.Now;
    DateTime _importedTime;
    DateTime _savedTime;
    TimeSpan _diff;

    private LogWriter _logger;
    private bool _seed;

    public ImportStat(LogWriter logger, string table)
    {
      _logger = logger;
      _table = table;
    }

    public void Imported()
    {
      _importedTime = DateTime.Now;
    }

    public void Saved(int count)
    {
      _savedTime = DateTime.Now;
      _count = count;
    }

    public void Log()
    {
      var msg = string.Format("Imported {0}; Count {1}; Import Time {2}; Save Time {3}", _table, _count, _importedTime.ToString(), _savedTime.ToString());
      _logger.Write(msg);
    }
  }

}
