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

      #region Division
      modelBuilder.Entity<Division>(entity =>
      {
        entity.ToTable("Divisions");

        entity.HasKey(x => new { x.DivisionId });

        //entity.HasIndex(x => new { x.DivisionShortName }).IsUnique();  // TODO, ADD LATER AFTER CLEAN UP DATA
        entity.HasIndex(x => new { x.DivisionLongName }).IsUnique();
      });
      #endregion

      #region Game
      modelBuilder.Entity<Game>(entity =>
      {
        entity.ToTable("Games");

        entity.Property(e => e.GameDateTime).HasColumnType("smalldatetime");

        entity.HasKey(x => new { x.GameId });

        entity.HasOne(x => x.Season).WithMany(s => s.Games).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.SeasonId);
      });
      #endregion

      #region Player
      modelBuilder.Entity<Player>(entity =>
      {
        entity.ToTable("Players");

        entity.HasKey(x => new { x.PlayerId });
      });
      #endregion

      #region PlayerStatCareer
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

      #region PlayerStatGame
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

      #region PlayerStatSeason
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

      #region PlayerStatTeam
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

      #region PlayerStatTeam
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

      #region PlayerStatus
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

      #region PlayerStatusType
      modelBuilder.Entity<PlayerStatusType>(entity =>
      {
        entity.ToTable("PlayerStatusTypes");

        entity.HasKey(x => new { x.PlayerStatusTypeId });

        entity.HasIndex(x => new { x.PlayerStatusTypeName }).IsUnique();

      });
      #endregion

      #region Season
      modelBuilder.Entity<Season>(entity =>
      {
        entity.ToTable("Seasons");

        //entity.Property(e => e.SeasonId).IsRequired();
        //entity.Property(e => e.SeasonName).IsRequired();
        //entity.Property(e => e.IsCurrentSeason).IsRequired();
        //entity.Property(e => e.StartYYYYMMDD).IsRequired();
        //entity.Property(e => e.EndYYYYMMDD).IsRequired();

        entity.HasKey(x => new { x.SeasonId });

        entity.HasIndex(x => new { x.SeasonName }).IsUnique();
      });
      #endregion

      #region Team
      modelBuilder.Entity<Team>(entity =>
      {
        entity.ToTable("Teams");
        
        entity.HasKey(x => new { x.TeamId });

        entity.HasIndex(x => new { x.SeasonId, x.TeamCode }).IsUnique();
        entity.HasIndex(x => new { x.SeasonId, x.TeamNameShort }).IsUnique();
        entity.HasIndex(x => new { x.SeasonId, x.TeamNameLong }).IsUnique();

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
      builder.Entity<ScoreSheetEntryProcessedSub>().HasIndex(x => new { x.SeasonId, x.TeamId, x.GameId, x.SubPlayerId, x.SubbingForPlayerId }).IsUnique();

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