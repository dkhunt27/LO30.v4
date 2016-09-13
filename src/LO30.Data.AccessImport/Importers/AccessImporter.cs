using LO30.Data;
using LO30.Data.AccessImport.Services;
using System;
using System.Diagnostics;

namespace LO30.Data.AccessImport.Importers
{
  public partial class AccessImporter
  {
    private JsonFileService _jsonFileService = new JsonFileService();
    private string _folderPath = @"D:\git\LO30.Data.RawData\Access\";
    DateTime _first = DateTime.Now;
    DateTime _last = DateTime.Now;
    TimeSpan _diffFromFirst = new TimeSpan();
    TimeSpan _diffFromLast = new TimeSpan();

    private LogWriter _logger;
    private LO30DbContext _context;
    private LO30ContextService _lo30ContextService;
    private bool _seed;
    private bool _loadNewData;

    public AccessImporter(LogWriter logger, LO30DbContext context, bool seed = true, bool loadNewData = false)
    {
      _logger = logger;
      _context = context;
      _lo30ContextService = new LO30ContextService(context);
      _seed = seed;
      _loadNewData = loadNewData;
    }
    
    private int ContextSaveChanges()
    {
      try
      {
        return _context.SaveChanges();
      }
      //catch (DbEntityValidationException e)
      //{
      //  foreach (var eve in e.EntityValidationErrors)
      //  {
      //    _logger.Write("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:", eve.Entry.Entity.GetType().Name, eve.Entry.State);
      //    foreach (var ve in eve.ValidationErrors)
      //    {
      //      _logger.Write("- Property: \"{0}\", Error: \"{1}\"", ve.PropertyName, ve.ErrorMessage);
      //    }
      //  }
      //  throw;

      //}
      catch (Exception ex)
      {
        _logger.Write(ex.Message);
        var innerEx = ex.InnerException;

        while (innerEx != null)
        {
          _logger.Write("With inner exception of:");
          _logger.Write(innerEx.Message);

          innerEx = innerEx.InnerException;
        }

        _logger.Write(ex.StackTrace);

        throw ex;
      }
    }

    private int ConvertDateTimeIntoYYYYMMDD(DateTime? toConvert, bool ifNullReturnMax)
    {
      int result = -1;

      if (toConvert == null)
      {
        if (ifNullReturnMax)
        {
          result = GetMaxYYYYMMDD();
        }
        else
        {
          result = GetMinYYYYMMDD();
        }
      }
      else
      {
        result = (toConvert.Value.Year * 10000) + (toConvert.Value.Month * 100) + toConvert.Value.Day;
      }

      return result;
    }

    private int GetMinYYYYMMDD()
    {
      int result = 12345678;
      return result;
    }

    private int GetMaxYYYYMMDD()
    {
      int result = 87654321;
      return result;
    }
  }

}
