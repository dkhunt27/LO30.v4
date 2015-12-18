using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LO30.Web.Models.Objects
{
  public class ScoreSheetEntryProcessedPenalty
  {
    [Key, Column(Order = 1), DatabaseGenerated(DatabaseGeneratedOption.None)]
    public int ScoreSheetEntryPenaltyId { get; set; }

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
    public int PlayerId { get; set; }

    [Required]
    public int PenaltyId { get; set; }

    [Required, MaxLength(5)]
    public string TimeRemaining { get; set; }

    public TimeSpan TimeElapsed { get; set; }

    [Required]
    public int PenaltyMinutes { get; set; }

    [Required]
    public DateTime UpdatedOn { get; set; }

    // virtual, foreign keys
    [ForeignKey("SeasonId")]
    public virtual Season Season { get; set; }

    [ForeignKey("TeamId")]
    public virtual Team Team { get; set; }

    [ForeignKey("GameId")]
    public virtual Game Game { get; set; }

    [ForeignKey("PlayerId")]
    public virtual Player Player { get; set; }

    [ForeignKey("PenaltyId")]
    public virtual Penalty Penalty { get; set; }

    public ScoreSheetEntryProcessedPenalty()
    {
    }

    public ScoreSheetEntryProcessedPenalty(int ssepid, int sid, int tid, int gid, int per, bool ht, int playid, int penid, string time, int pim, DateTime upd)
    {
      this.ScoreSheetEntryPenaltyId = ssepid;
      this.SeasonId = sid;
      this.TeamId = tid;
      this.GameId = gid;

      this.Period = per;
      this.HomeTeam = ht;
      this.PlayerId = playid;
      this.PenaltyId = penid;

      this.TimeRemaining = time;
      this.PenaltyMinutes = pim;

      this.UpdatedOn = upd;

      Validate();
    }

    private void Validate()
    {
      var locationKey = string.Format("ssepid: {0}, sid: {1}, tid: {2}, gid: {3}, per: {4}, ht: {5}",
        this.ScoreSheetEntryPenaltyId,
        this.SeasonId,
        this.TeamId,
        this.GameId,
        this.Period,
        this.HomeTeam);
    }
  }
}