using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LO30.Web.Models.Objects
{
  public class PlayerStatCareer
  {
    [Required]
    public int PlayerId { get; set; }
    
    [Required]
    public int Seasons { get; set; }

    [Required]
    public int Games { get; set; }

    [Required]
    public int Goals { get; set; }

    [Required]
    public int Assists { get; set; }

    [Required]
    public int Points { get; set; }

    [Required]
    public int PenaltyMinutes { get; set; }

    [Required]
    public int PowerPlayGoals { get; set; }

    [Required]
    public int ShortHandedGoals { get; set; }

    [Required]
    public int GameWinningGoals { get; set; }

    [Required]
    public DateTime UpdatedOn { get; set; }

    // virtual, foreign keys dependent
    public virtual Player Player { get; set; }

    public PlayerStatCareer()
    {
      this.Seasons = 0;
      this.Games = 0;
      this.Goals = 0;
      this.Assists = 0;
      this.Points = 0;
      this.PenaltyMinutes = 0;
      this.PowerPlayGoals = 0;
      this.ShortHandedGoals = 0;
      this.GameWinningGoals = 0;

      Validate();
    }

    private void Validate()
    {
      var locationKey = string.Format("pid: {0}",
                                  this.PlayerId);

      if (this.Points != this.Goals + this.Assists)
      {
        throw new ArgumentException("Points must equal Goals + Assists for:" + locationKey, "Points");
      }

      if (this.PowerPlayGoals > this.Goals)
      {
        throw new ArgumentException("PowerPlayGoals must be less than or equal to Goals for:" + locationKey, "PowerPlayGoals");
      }

      if (this.ShortHandedGoals > this.Goals)
      {
        throw new ArgumentException("ShortHandedGoals must be less than or equal to Goals for:" + locationKey, "ShortHandedGoals");
      }

      if (this.GameWinningGoals > this.Goals)
      {
        throw new ArgumentException("GameWinningGoals must be less than or equal to Goals for:" + locationKey, "GameWinningGoals");
      }

      if (this.GameWinningGoals > this.Games)
      {
        throw new ArgumentException("GameWinningGoals must be less than or equal to Games for:" + locationKey, "GameWinningGoals");
      }
    }
  }
}