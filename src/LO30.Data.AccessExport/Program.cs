using System;
using System.IO;

namespace LO30.Data.AccessExport
{
  class Program
  {
    private static AccessDatabaseService _accessDatabaseService;

    static void Main(string[] args)
    {
      _accessDatabaseService = new AccessDatabaseService();

      Console.WriteLine("Saving Access DB to JSON Files");
      _accessDatabaseService.SaveTablesToJson();
      Console.WriteLine("Saved Access DB to JSON Files");

    }
  }
}
