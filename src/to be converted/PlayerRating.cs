﻿using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LO30.Web.Models.Objects
{
  public class PlayerRating
  {
    private const string _posDefault = "X";
    private const int _rpDefault = 0;
    private const int _rsDefault = 0;
    private const int _lineDefault = 0;

    [Required, Key, Column(Order = 1)]
    public int SeasonId { get; set; }

    [Required, Key, Column(Order = 2)]
    public int PlayerId { get; set; }

    [Required, Key, Column(Order = 3)]
    public int StartYYYYMMDD { get; set; }

    [Required, Key, Column(Order = 4)]
    public int EndYYYYMMDD { get; set; }

    [Required, Key, Column(Order = 5), MaxLength(1)]
    public string Position { get; set; }

    [Required]
    public int RatingPrimary { get; set; }

    [Required]
    public int RatingSecondary { get; set; }

    // virtual, foreign keys
    [ForeignKey("SeasonId")]
    public virtual Season Season { get; set; }

    [ForeignKey("PlayerId")]
    public virtual Player Player { get; set; }

    public PlayerRating()
    {
    }

    public PlayerRating(int sid, int pid, int symd, int eymd, int rp, int rs)
      : this(sid, pid, symd, eymd, _posDefault, rp, rs)
    {
    }

    public PlayerRating(int sid, int pid, int symd, int eymd, string pos, int rp, int rs)
    {
      this.SeasonId = sid;
      this.PlayerId = pid;
      this.StartYYYYMMDD = symd;
      this.EndYYYYMMDD = eymd;
      this.Position = pos;

      this.RatingPrimary = rp;
      this.RatingSecondary = rs;

      Validate();
    }

    private void Validate()
    {
      var locationKey = string.Format("sid: {0}, pid: {1}, symd: {2}, eymd: {3}, pos: {4}",
                            this.SeasonId,
                            this.PlayerId,
                            this.StartYYYYMMDD,
                            this.EndYYYYMMDD,
                            this.Position);

      if (this.Position != "G" && this.Position != "D" && this.Position != "F" && this.Position != "X")
      {
        throw new ArgumentException("Position('" + this.Position + "') must be 'X', 'G', 'D', or 'F' for:" + locationKey, "Position");
      }

      if (this.RatingPrimary < 0 || this.RatingPrimary > 9)
      {
        throw new ArgumentException("RatingPrimary(" + this.RatingPrimary + ") must be between 0 and 9:" + locationKey, "RatingPrimary");
      }

      if (this.RatingSecondary < 0 || this.RatingSecondary > 8)
      {
        throw new ArgumentException("RatingSecondary(" + this.RatingSecondary + ") must be between 0 and 8:" + locationKey, "RatingSecondary");
      }

    }
  }
}