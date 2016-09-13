using System.ComponentModel.DataAnnotations;

namespace LO30.Data
{
  public class GameTeam
  {
    [Required]
    public int GameId { get; set; }

    [Required]
    public int TeamId { get; set; }

    [Required]
    public bool HomeTeam { get; set; }

    [Required]
    public int OpponentTeamId { get; set; }

    [Required]
    public int SeasonId { get; set; }

    #region foreign keys referenced in another class
    // items in this class must exist before items in the classes below

    public virtual Season Season { get; set; }

    public virtual Team Team { get; set; }

    public virtual Game Game { get; set; }

    public virtual Team OpponentTeam { get; set; }
    #endregion
  }
}