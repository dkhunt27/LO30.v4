using System;

namespace LO30.Data.AccessImport.Services
{
  public class LogWriter
  {
    public LogWriter()
    {
    }

    public void Write(string msg)
    {
      Console.WriteLine(msg);
    }

    public bool IsLoggingEnabled()
    {
      return true;
    }

  }
  public class LogService
  {
    public LogService()
    {
    }

    public LogWriter CreateLogger()
    {
      return new LogWriter();
    }
    
  }
}