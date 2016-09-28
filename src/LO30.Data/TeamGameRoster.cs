using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LO30.Data
{
  public class TeamGameRoster
  {
    public bool GameProcessed { get; set; }

    public bool RosteredPlayed { get; set; }

    public bool RosteredWasSubbedFor { get; set; }

    public TeamRoster Rostered { get; set; }

    public List<GameRoster> SubbedForRostered { get; set; }

    public TeamGameRoster()
    {
      this.GameProcessed = false;
      this.RosteredPlayed = true;
      this.RosteredWasSubbedFor = false;
    }
  }
}