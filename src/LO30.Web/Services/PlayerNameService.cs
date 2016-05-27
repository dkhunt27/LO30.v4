
namespace LO30.Web.Services
{
  public class PlayerNameService
  {
    public string BuildPlayerNameCode(string playerNameFirst, string playerNameLast, string playerNameSuffix)
    {
      return BuildPlayerName(playerNameFirst, playerNameLast, playerNameSuffix, 15);
    }

    public string BuildPlayerNameShort(string playerNameFirst, string playerNameLast, string playerNameSuffix)
    {
      return BuildPlayerName(playerNameFirst, playerNameLast, playerNameSuffix, 25);
    }

    public string BuildPlayerNameLong(string playerNameFirst, string playerNameLast, string playerNameSuffix)
    {
      return BuildPlayerName(playerNameFirst, playerNameLast, playerNameSuffix, 50);
    }

    private string BuildPlayerName(string playerNameFirst, string playerNameLast, string playerNameSuffix, int limit)
    {
      string playerName = string.Empty;

      if (string.IsNullOrWhiteSpace(playerNameSuffix))
      {
        if (playerNameFirst.Length + playerNameLast.Length + 1 <= limit)
        {
          playerName = playerNameFirst + " " + playerNameLast;
        }
        else if (3 + playerNameLast.Length + 1 <= limit)
        {
          playerName = playerNameFirst.Substring(0, 1) + ". " + playerNameLast;

          if (playerName.Length > limit)
          {
            playerName = playerName.Substring(0, limit-1) + ".";
          }
        }
      }
      else
      {
        if (playerNameFirst.Length + playerNameLast.Length + playerNameSuffix.Length + 3 <= limit)
        {
          playerName = playerNameFirst + " " + playerNameLast + ", " + playerNameSuffix;
        }
        else if (3 + playerNameLast.Length + playerNameSuffix.Length + 2 <= limit)
        {
          playerName = playerNameFirst.Substring(0, 1) + ". " + playerNameLast + ", " + playerNameSuffix;
        }
        else
        {
          playerName = BuildPlayerName(playerNameFirst, playerNameLast, string.Empty, limit);
        }
      }

      return playerName;
    }
  }
}
