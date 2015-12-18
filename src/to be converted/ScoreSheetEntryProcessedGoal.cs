using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LO30.Web.Models.Objects
{
  public class ScoreSheetEntryProcessedGoal
  {
    [Key, Column(Order = 1), DatabaseGenerated(DatabaseGeneratedOption.None)]
    public int ScoreSheetEntryGoalId { get; set; }

    [Required]
    public int SeasonId { get; set; }

    [Required]
    public int TeamId { get; set; }

    [Required]
    public int GameId { get; set; }

    [Required]
    public int Period { get; set; }

    [Required]
    public bool HomeTeam { get; set; }

    [Required]
    public int GoalPlayerId { get; set; }

    public int? Assist1PlayerId { get; set; }

    public int? Assist2PlayerId { get; set; }

    public int? Assist3PlayerId { get; set; }

    [Required, MaxLength(5)]
    public string TimeRemaining { get; set; }

    public TimeSpan TimeElapsed { get; set; }

    [Required]
    public bool ShortHandedGoal { get; set; }

    [Required]
    public bool PowerPlayGoal { get; set; }

    [Required]
    public bool GameWinningGoal { get; set; }

    [Required]
    public DateTime UpdatedOn { get; set; }

    // virtual, foreign keys
    [ForeignKey("SeasonId")]
    public virtual Season Season { get; set; }

    [ForeignKey("TeamId")]
    public virtual Team Team { get; set; }

    [ForeignKey("GameId")]
    public virtual Game Game { get; set; }

    [ForeignKey("GoalPlayerId")]
    public virtual Player GoalPlayer { get; set; }

    [ForeignKey("Assist1PlayerId")]
    public virtual Player Assist1Player { get; set; }

    [ForeignKey("Assist2PlayerId")]
    public virtual Player Assist2Player { get; set; }

    [ForeignKey("Assist3PlayerId")]
    public virtual Player Assist3Player { get; set; }

    public ScoreSheetEntryProcessedGoal()
    {
    }

    public ScoreSheetEntryProcessedGoal(int ssegid, int sid, int tid, int gid, int per, bool ht, int gpid, int? a1pid, int? a2pid, int? a3pid, string time, bool shg, bool ppg, bool gwg, DateTime upd)
    {
      this.ScoreSheetEntryGoalId = ssegid;
      this.SeasonId = sid;
      this.TeamId = tid;
      this.GameId = gid;

      this.Period = per;
      this.HomeTeam = ht;
      this.GoalPlayerId = gpid;
      this.Assist1PlayerId = a1pid;
      this.Assist2PlayerId = a2pid;
      this.Assist3PlayerId = a3pid;

      this.TimeRemaining = time;

      this.ShortHandedGoal = shg;
      this.PowerPlayGoal = ppg;
      this.GameWinningGoal = gwg;

      this.UpdatedOn = upd;

      Validate();
    }

    private void Validate()
    {
      var locationKey = string.Format("ssegid: {0}, sid: {1}, tid: {2}, gid: {3}, per: {4}, ht: {5}",
        this.ScoreSheetEntryGoalId,
        this.SeasonId,
        this.TeamId,
        this.GameId,
        this.Period,
        this.HomeTeam);
    }
  }
}