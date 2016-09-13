using Newtonsoft.Json;
using System.IO;
using System.Text;

namespace LO30.Data.AccessImport.Services
{
  public class JsonFileService
  {
    public JsonFileService()
    {
    }

    public void SaveObjToJsonFile(dynamic obj, string destPath)
    {
      var output = JsonConvert.SerializeObject(obj, Formatting.Indented);

      StringBuilder sb = new StringBuilder();
      sb.Append(output);
      File.WriteAllText(destPath, sb.ToString());
    }

    public dynamic ParseObjectFromJsonFile(string srcPath)
    {
      string contents = File.ReadAllText(srcPath);
      dynamic parsedJson = JsonConvert.DeserializeObject(contents);
      return parsedJson;
    }
  }
}
