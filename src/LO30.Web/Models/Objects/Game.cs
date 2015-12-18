using LO30.Web.Services;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LO30.Web.Models.Objects
{
  public class Game
  {
    [Required]
    public int GameId { get; set; }

    [Required]
    public int SeasonId { get; set; }

    [Required]
    public bool Playoffs { get; set; }

    [Required]
    public DateTime GameDateTime { get; set; }

    [Required]
    public int GameYYYYMMDD { get; set; }

    [Required, MaxLength(15)]
    public string Location { get; set; }

    // virtual, foreign keys dependent 
    public virtual Season Season { get; set; }

    // virtual, foreign key principal
    public virtual List<PlayerStatGame> PlayerStatGames { get; set; }

    public Game()
    {
    }

    public Game(int sid, int gid, bool pfs, DateTime time, string loc)
    {
      this.SeasonId = sid;
      this.GameId = gid;
      this.Playoffs = pfs;

      this.GameDateTime = time;
      this.GameYYYYMMDD = ConvertDateTimeIntoYYYYMMDD(time, ifNullReturnMax: false);
      this.Location = loc;
    }

    public int ConvertDateTimeIntoYYYYMMDD(DateTime? toConvert, bool ifNullReturnMax)
    {
      var lo30DataTimeService = new TimeService();
      return lo30DataTimeService.ConvertDateTimeIntoYYYYMMDD(toConvert, ifNullReturnMax);
    }
  }
}