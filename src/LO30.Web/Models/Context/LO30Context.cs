using System;
using Microsoft.Data.Entity;
using LO30.Web.Models.Objects;
using Microsoft.Data.Entity.Metadata;

namespace LO30.Web.Models.Context
{
  public class LO30DbContext : DbContext
  {
    public LO30DbContext()
    {
      Database.EnsureCreated();
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
      base.OnConfiguring(optionsBuilder);
    }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      base.OnModelCreating(modelBuilder);
      // Customize the ASP.NET Identity model and override the defaults if needed.
      // For example, you can rename the ASP.NET Identity table names and more.
      // Add your customizations after calling base.OnModelCreating(modelBuilder);

      #region Division (PK, PK2)
      modelBuilder.Entity<Division>(entity =>
      {
        entity.ToTable("Divisions");

        entity.HasKey(x => new { x.DivisionId });

        //entity.HasIndex(x => new { x.DivisionShortName }).HasName("PK2").IsUnique();  // TODO, ADD LATER AFTER CLEAN UP DATA
        entity.HasIndex(x => new { x.DivisionLongName }).HasName("PK2").IsUnique();
      });
      #endregion

      #region Game (PK, FK[1-N], column type)
      modelBuilder.Entity<Game>(entity =>
      {
        entity.ToTable("Games");

        entity.Property(e => e.GameDateTime).HasColumnType("smalldatetime");

        entity.HasKey(x => new { x.GameId });

        entity.HasOne(x => x.Season).WithMany(s => s.Games).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.SeasonId);
      });
      #endregion

      #region GameOutcome (PK, PK2, FK[1-N], column type)
      modelBuilder.Entity<GameOutcome>(entity =>
      {
        entity.ToTable("GameOutcomes");
        
        entity.HasKey(x => new { x.GameId, x.TeamId });

        entity.HasIndex(x => new { x.GameId, x.HomeTeam }).HasName("PK2").IsUnique();

        entity.HasOne(d => d.Season).WithMany(p => p.GameOutcomes).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.SeasonId);

        entity.HasOne(d => d.Team).WithMany(p => p.GameOutcomes).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.TeamId);

        entity.HasOne(d => d.Game).WithMany(p => p.GameOutcomes).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.GameId);

        entity.HasOne(d => d.OpponentTeam).WithMany(p => p.GameOutcomesOpponent).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.OpponentTeamId);
      });
      #endregion

      #region GameOutcomeOverride (PK, FK[1-N])
      modelBuilder.Entity<GameOutcomeOverride>(entity =>
      {
        entity.ToTable("GameOutcomeOverrides");

        entity.HasKey(x => new { x.GameId, x.TeamId });
        
        entity.HasOne(d => d.Season).WithMany(p => p.GameOutcomeOverrides).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.SeasonId);

        entity.HasOne(d => d.Team).WithMany(p => p.GameOutcomeOverrides).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.TeamId);

        entity.HasOne(d => d.Game).WithMany(p => p.GameOutcomeOverrides).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.GameId);
      });
      #endregion

      #region GameRoster (PK, PK2, FK[1-N])
      modelBuilder.Entity<GameRoster>(entity =>
      {
        entity.ToTable("GameRosters");

        entity.HasKey(x => new { x.GameRosterId });

        entity.HasIndex(x => new { x.GameId, x.TeamId, x.PlayerNumber }).HasName("PK2").IsUnique();

        entity.HasIndex(x => new { x.GameId, x.TeamId, x.PlayerId }).HasName("PK3").IsUnique();

        entity.HasOne(d => d.Season).WithMany(p => p.GameRosters).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.SeasonId);

        entity.HasOne(d => d.Team).WithMany(p => p.GameRosters).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.TeamId);

        entity.HasOne(d => d.Game).WithMany(p => p.GameRosters).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.GameId);

        entity.HasOne(d => d.Player).WithMany(p => p.GameRosters).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.PlayerId);

        entity.HasOne(d => d.SubbingForPlayer).WithMany(p => p.GameRostersSubbedFor).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.SubbingForPlayerId);
      });
      #endregion

      #region GameScore (PK, FK[1-N])
      modelBuilder.Entity<GameScore>(entity =>
      {
        entity.ToTable("GameScores");

        entity.HasKey(x => new { x.GameId, x.TeamId, x.Period });

        entity.HasOne(d => d.Season).WithMany(p => p.GameScores).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.SeasonId);

        entity.HasOne(d => d.Team).WithMany(p => p.GameScores).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.TeamId);

        entity.HasOne(d => d.Game).WithMany(p => p.GameScores).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.GameId);
      });
      #endregion

      #region GameTeam (PK, PK2, FK[1-N])
      modelBuilder.Entity<GameTeam>(entity =>
      {
        entity.ToTable("GameTeams");

        entity.HasKey(x => new { x.GameId, x.TeamId });

        entity.HasIndex(x => new { x.GameId, x.HomeTeam }).HasName("PK2").IsUnique();

        entity.HasOne(d => d.Season).WithMany(p => p.GameTeams).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.SeasonId);

        entity.HasOne(d => d.Team).WithMany(p => p.GameTeams).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.TeamId);

        entity.HasOne(d => d.Game).WithMany(p => p.GameTeams).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.GameId);

        entity.HasOne(d => d.OpponentTeam).WithMany(p => p.GameTeamOpponents).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.OpponentTeamId);
      });
      #endregion

      #region GoalieStatCareer (PK, FK[1-1], column type)
      modelBuilder.Entity<GoalieStatCareer>(entity =>
      {
        entity.ToTable("GoalieStatCareers");

        entity.Property(e => e.UpdatedOn).HasColumnType("smalldatetime").HasDefaultValueSql("getdate()");

        entity.HasKey(x => new { x.PlayerId });

        entity.HasOne(d => d.Player).WithOne(p => p.GoalieStatCareer).OnDelete(DeleteBehavior.Restrict);
        entity.HasAlternateKey(x => x.PlayerId);
        entity.HasIndex(x => x.PlayerId).IsUnique();
      });
      #endregion

      #region GoalieStatGame (PK, FK[1-N], column type)
      modelBuilder.Entity<GoalieStatGame>(entity =>
      {
        entity.ToTable("GoalieStatGames");

        entity.Property(e => e.UpdatedOn).HasColumnType("smalldatetime").HasDefaultValueSql("getdate()");

        entity.HasKey(x => new { x.PlayerId, x.GameId });

        entity.HasOne(d => d.Season).WithMany(p => p.GoalieStatGames).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.SeasonId);

        entity.HasOne(d => d.Team).WithMany(p => p.GoalieStatGames).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.TeamId);

        entity.HasOne(d => d.Game).WithMany(p => p.GoalieStatGames).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.GameId);

        entity.HasOne(d => d.Player).WithMany(p => p.GoalieStatGames).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.PlayerId);
      });
      #endregion

      #region GoalieStatSeason (PK, FK[1-N], column type)
      modelBuilder.Entity<GoalieStatSeason>(entity =>
      {
        entity.ToTable("GoalieStatSeasons");

        entity.Property(e => e.UpdatedOn).HasColumnType("smalldatetime").HasDefaultValueSql("getdate()");

        entity.HasKey(x => new { x.PlayerId, x.SeasonId, x.Playoffs });

        entity.HasOne(d => d.Season).WithMany(p => p.GoalieStatSeasons).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.SeasonId);

        entity.HasOne(d => d.Player).WithMany(p => p.GoalieStatSeasons).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.PlayerId);
      });
      #endregion

      #region GoalieStatTeam (PK, FK[1-N], column type)
      modelBuilder.Entity<GoalieStatTeam>(entity =>
      {
        entity.ToTable("GoalieStatTeams");

        entity.Property(e => e.UpdatedOn).HasColumnType("smalldatetime").HasDefaultValueSql("getdate()");

        entity.HasKey(x => new { x.PlayerId, x.TeamId, x.Playoffs, x.Sub });

        entity.HasOne(d => d.Season).WithMany(p => p.GoalieStatTeams).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.SeasonId);

        entity.HasOne(d => d.Team).WithMany(p => p.GoalieStatTeams).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.TeamId);

        entity.HasOne(d => d.Player).WithMany(p => p.GoalieStatTeams).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.PlayerId);
      });
      #endregion

      #region Player (PK)
      modelBuilder.Entity<Player>(entity =>
      {
        entity.ToTable("Players");

        entity.HasKey(x => new { x.PlayerId });
      });
      #endregion

      #region PlayerStatCareer (PK, FK[1-1], column type)
      modelBuilder.Entity<PlayerStatCareer>(entity =>
      {
        entity.ToTable("PlayerStatCareers");

        entity.Property(e => e.UpdatedOn).HasColumnType("smalldatetime").HasDefaultValueSql("getdate()");

        entity.HasKey(x => new { x.PlayerId });

        entity.HasOne(d => d.Player).WithOne(p => p.PlayerStatCareer).OnDelete(DeleteBehavior.Restrict);
        entity.HasAlternateKey(x => x.PlayerId);
        entity.HasIndex(x => x.PlayerId).IsUnique();
      });
      #endregion

      #region PlayerStatGame (PK, FK[1-N], column type)
      modelBuilder.Entity<PlayerStatGame>(entity =>
      {
        entity.ToTable("PlayerStatGames");

        //entity.Property(e => e.PlayerId).IsRequired();
        //entity.Property(e => e.GameId).IsRequired();
        //entity.Property(e => e.TeamId).IsRequired();
        //entity.Property(e => e.Playoffs).IsRequired();
        //entity.Property(e => e.SeasonId).IsRequired();
        //entity.Property(e => e.Sub).IsRequired();
        //entity.Property(e => e.Line).IsRequired();
        //entity.Property(e => e.Position).IsRequired();
        //entity.Property(e => e.Goals).IsRequired();
        //entity.Property(e => e.Assists).IsRequired();
        //entity.Property(e => e.Points).IsRequired();
        //entity.Property(e => e.PenaltyMinutes).IsRequired();
        //entity.Property(e => e.PowerPlayGoals).IsRequired();
        //entity.Property(e => e.ShortHandedGoals).IsRequired();
        //entity.Property(e => e.GameWinningGoals).IsRequired();
        //entity.Property(e => e.UpdatedOn).IsRequired();

        entity.Property(e => e.UpdatedOn).HasColumnType("smalldatetime").HasDefaultValueSql("getdate()");

        entity.HasKey(x => new { x.PlayerId, x.GameId });

        entity.HasOne(d => d.Season).WithMany(p => p.PlayerStatGames).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.SeasonId);

        entity.HasOne(d => d.Team).WithMany(p => p.PlayerStatGames).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.TeamId);

        entity.HasOne(d => d.Game).WithMany(p => p.PlayerStatGames).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.GameId);

        entity.HasOne(d => d.Player).WithMany(p => p.PlayerStatGames).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.PlayerId);
      });
      #endregion

      #region PlayerStatSeason (PK, FK[1-N], column type)
      modelBuilder.Entity<PlayerStatSeason>(entity =>
      {
        entity.ToTable("PlayerStatSeasons");

        entity.Property(e => e.UpdatedOn).HasColumnType("smalldatetime").HasDefaultValueSql("getdate()");

        entity.HasKey(x => new { x.PlayerId, x.SeasonId, x.Playoffs });

        entity.HasOne(d => d.Season).WithMany(p => p.PlayerStatSeasons).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.SeasonId);

        entity.HasOne(d => d.Player).WithMany(p => p.PlayerStatSeasons).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.PlayerId);
      });
      #endregion

      #region PlayerStatTeam (PK, FK[1-N], column type)
      modelBuilder.Entity<PlayerStatTeam>(entity =>
      {
        entity.ToTable("PlayerStatTeams");

        entity.Property(e => e.UpdatedOn).HasColumnType("smalldatetime").HasDefaultValueSql("getdate()");

        entity.HasKey(x => new { x.PlayerId, x.TeamId, x.Playoffs, x.Sub });

        entity.HasOne(d => d.Season).WithMany(p => p.PlayerStatTeams).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.SeasonId);

        entity.HasOne(d => d.Team).WithMany(p => p.PlayerStatTeams).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.TeamId);

        entity.HasOne(d => d.Player).WithMany(p => p.PlayerStatTeams).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.PlayerId);
      });
      #endregion

      #region PlayerStatus (PK, FK[1-N])
      modelBuilder.Entity<PlayerStatus>(entity =>
      {
        entity.ToTable("PlayerStatuses");

        entity.HasKey(x => new { x.PlayerId, x.EventYYYYMMDD });

        entity.HasOne(d => d.PlayerStatusType).WithMany(p => p.PlayerStatuses).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.PlayerStatusTypeId);

        entity.HasOne(d => d.Player).WithMany(p => p.PlayerStatuses).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.PlayerId);
      });
      #endregion

      #region PlayerStatusType (PK, PK2)
      modelBuilder.Entity<PlayerStatusType>(entity =>
      {
        entity.ToTable("PlayerStatusTypes");

        entity.HasKey(x => new { x.PlayerStatusTypeId });

        entity.HasIndex(x => new { x.PlayerStatusTypeName }).HasName("PK2").IsUnique();

      });
      #endregion

      #region Season (PK, PK2)
      modelBuilder.Entity<Season>(entity =>
      {
        entity.ToTable("Seasons");

        //entity.Property(e => e.SeasonId).IsRequired();
        //entity.Property(e => e.SeasonName).IsRequired();
        //entity.Property(e => e.IsCurrentSeason).IsRequired();
        //entity.Property(e => e.StartYYYYMMDD).IsRequired();
        //entity.Property(e => e.EndYYYYMMDD).IsRequired();

        entity.HasKey(x => new { x.SeasonId });

        entity.HasIndex(x => new { x.SeasonName }).HasName("PK2").IsUnique();
      });
      #endregion

      #region Team (PK, PK2, FK[1-N])
      modelBuilder.Entity<Team>(entity =>
      {
        entity.ToTable("Teams");
        
        entity.HasKey(x => new { x.TeamId });

        entity.HasIndex(x => new { x.SeasonId, x.TeamCode }).HasName("PK2").IsUnique();
        entity.HasIndex(x => new { x.SeasonId, x.TeamNameShort }).HasName("PK3").IsUnique();
        entity.HasIndex(x => new { x.SeasonId, x.TeamNameLong }).HasName("PK4").IsUnique();

        entity.HasOne(d => d.Season).WithMany(p => p.Teams).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.SeasonId);

        entity.HasOne(d => d.Coach).WithMany(p => p.CoachedTeams).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.CoachId);

        entity.HasOne(d => d.Sponsor).WithMany(p => p.SponsoredTeams).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.SponsorId);

        entity.HasOne(d => d.Division).WithMany(p => p.DivisionalTeams).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.DivisionId);
      });
      #endregion

      #region ScoreSheetEntryProcessedSub
      /*
      builder.Entity<ScoreSheetEntryProcessedSub>().HasKey(x => new { x.ScoreSheetEntrySubId });
      builder.Entity<ScoreSheetEntryProcessedSub>().HasIndex(x => new { x.SeasonId, x.TeamId, x.GameId, x.SubPlayerId, x.SubbingForPlayerId }).HasName("PK2").IsUnique();

      builder.Entity<ScoreSheetEntryProcessedSub>().HasAlternateKey(x => x.SeasonId);
      builder.Entity<ScoreSheetEntryProcessedSub>().HasAlternateKey(x => x.TeamId);
      builder.Entity<ScoreSheetEntryProcessedSub>().HasAlternateKey(x => x.GameId);    
      builder.Entity<ScoreSheetEntryProcessedSub>().HasAlternateKey(x => x.SubPlayerId);
      builder.Entity<ScoreSheetEntryProcessedSub>().HasAlternateKey(x => x.SubbingForPlayerId);
      */
      #endregion
    }

    public DbSet<Division> Divisions { get; set; }
    public DbSet<Game> Games { get; set; }
    public DbSet<GameOutcome> GameOutcomes { get; set; }
    public DbSet<GameOutcomeOverride> GameOutcomeOverrides { get; set; }
    public DbSet<GameRoster> GameRosters { get; set; }
    public DbSet<GameScore> GameScores { get; set; }
    public DbSet<GameTeam> GameTeams { get; set; }
    public DbSet<Player> Players { get; set; }
    public DbSet<PlayerStatCareer> PlayerStatCareers { get; set; }
    public DbSet<PlayerStatGame> PlayerStatGames { get; set; }
    public DbSet<PlayerStatSeason> PlayerStatSeason { get; set; }
    public DbSet<PlayerStatTeam> PlayerStatTeams { get; set; }
    public DbSet<PlayerStatus> PlayerStatuses { get; set; }
    public DbSet<PlayerStatusType> PlayerStatusTypes { get; set; }
    public DbSet<Season> Seasons { get; set; }
    public DbSet<Team> Teams { get; set; }
  }
}