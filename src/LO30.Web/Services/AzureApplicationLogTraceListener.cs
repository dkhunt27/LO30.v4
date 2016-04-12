using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace LO30.Web.Services
{
  //http://stackoverflow.com/questions/34866674/logging-from-asp-net-5-application-hosted-as-azure-web-app

  /*public class AzureApplicationLogTraceListener : TraceListener
  {
    private readonly string _logPath;
    private readonly object _lock = new object();

    public AzureApplicationLogTraceListener()
    {
      string instanceId = Environment.GetEnvironmentVariable("WEBSITE_INSTANCE_ID");
      if (instanceId != null)
      {
        string logFolder = Environment.ExpandEnvironmentVariables(@"%HOME%\LogFiles\application");
        Directory.CreateDirectory(logFolder);
        instanceId = instanceId.Substring(0, 6);
        _logPath = Path.Combine(logFolder, $"logs_{instanceId}.txt");

      }
    }

    public override void Write(string message)
    {
      if (_logPath != null)
      {
        lock (this)
        {
          File.AppendAllText(_logPath, message);
        }
      }
    }

    public override void WriteLine(string message)
    {
      Write(message + Environment.NewLine);
    }
  }*/
}
