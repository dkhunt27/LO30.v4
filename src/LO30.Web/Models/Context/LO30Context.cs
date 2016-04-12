using System;
using Microsoft.Data.Entity;
using LO30.Web.Models.Objects;
using Microsoft.Data.Entity.Metadata;
using Microsoft.AspNet.Identity.EntityFramework;

namespace LO30.Web.Models.Context
{
  public class LO30DbContext : IdentityDbContext<ApplicationUser>
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

        entity.HasKey(x => new { x.PlayerId, x.TeamId, x.Playoffs, x.Sub });

        entity.HasOne(d => d.Season).WithMany(p => p.GoalieStatTeams).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.SeasonId);

        entity.HasOne(d => d.Team).WithMany(p => p.GoalieStatTeams).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.TeamId);

        entity.HasOne(d => d.Player).WithMany(p => p.GoalieStatTeams).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.PlayerId);
      });
      #endregion

      #region Penalty (PK, PK2)
      modelBuilder.Entity<Penalty>(entity =>
      {
        entity.ToTable("Penalties");

        entity.HasKey(x => new { x.PenaltyId });

        entity.HasIndex(x => new { x.PenaltyCode }).HasName("PK2").IsUnique();

        entity.HasIndex(x => new { x.PenaltyName }).HasName("PK3").IsUnique();

      });
      #endregion

      #region Player (PK)
      modelBuilder.Entity<Player>(entity =>
      {
        entity.ToTable("Players");

        entity.HasKey(x => new { x.PlayerId });
      });
      #endregion

      #region PlayerDraft (PK, FK[1-N])
      modelBuilder.Entity<PlayerDraft>(entity =>
      {
        entity.ToTable("PlayerDrafts");

        entity.HasKey(x => new { x.SeasonId, x.PlayerId });

        entity.HasOne(d => d.Season).WithMany(p => p.PlayerDrafts).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.SeasonId);

        entity.HasOne(d => d.Player).WithMany(p => p.PlayerDrafts).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.PlayerId);
      });
      #endregion

      #region PlayerRating (PK, FK[1-N])
      modelBuilder.Entity<PlayerRating>(entity =>
      {
        entity.ToTable("PlayerRatings");

        entity.HasKey(x => new { x.SeasonId, x.PlayerId, x.EndYYYYMMDD, x.Position });

        entity.HasOne(d => d.Season).WithMany(p => p.PlayerRatings).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.SeasonId);

        entity.HasOne(d => d.Player).WithMany(p => p.PlayerRatings).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.PlayerId);
      });
      #endregion

      #region PlayerStatCareer (PK, FK[1-1], column type)
      modelBuilder.Entity<PlayerStatCareer>(entity =>
      {
        entity.ToTable("PlayerStatCareers");

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

      #region ScoreSheetEntryGoal (PK, FK[1-N])
      modelBuilder.Entity<ScoreSheetEntryGoal>(entity =>
      {
        entity.ToTable("ScoreSheetEntryGoals");

        entity.HasKey(x => new { x.ScoreSheetEntryGoalId });

        entity.HasOne(d => d.Game).WithMany(p => p.ScoreSheetEntryGoals).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.GameId);
      });
      #endregion

      #region ScoreSheetEntryPenalty (PK, FK[1-N])
      modelBuilder.Entity<ScoreSheetEntryPenalty>(entity =>
      {
        entity.ToTable("ScoreSheetEntryPenalties");

        entity.HasKey(x => new { x.ScoreSheetEntryPenaltyId });

        entity.HasOne(d => d.Game).WithMany(p => p.ScoreSheetEntryPenalties).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.GameId);
      });
      #endregion

      #region ScoreSheetEntryProcessedGame (PK, FK[1-N], column type)
      modelBuilder.Entity<ScoreSheetEntryProcessedGame>(entity =>
      {
        entity.ToTable("ScoreSheetEntryProcessedGames");

        entity.HasKey(x => new { x.GameId });

        entity.HasOne(d => d.Game).WithMany(p => p.ScoreSheetEntryProcessedGames).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.GameId);
      });
      #endregion

      #region ScoreSheetEntryProcessedGoal (PK, FK[1-N], column type)
      modelBuilder.Entity<ScoreSheetEntryProcessedGoal>(entity =>
      {
        entity.ToTable("ScoreSheetEntryProcessedGoals");

        entity.HasKey(x => new { x.ScoreSheetEntryGoalId });

        entity.HasOne(d => d.Season).WithMany(p => p.ScoreSheetEntryProcessedGoals).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.SeasonId);

        entity.HasOne(d => d.Team).WithMany(p => p.ScoreSheetEntryProcessedGoals).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.TeamId);

        entity.HasOne(d => d.Game).WithMany(p => p.ScoreSheetEntryProcessedGoals).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.GameId);

        entity.HasOne(d => d.GoalPlayer).WithMany(p => p.ScoreSheetEntryProcessedGoalGoals).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.GoalPlayerId);

        entity.HasOne(d => d.Assist1Player).WithMany(p => p.ScoreSheetEntryProcessedGoalAssist1).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.Assist1PlayerId);

        entity.HasOne(d => d.Assist2Player).WithMany(p => p.ScoreSheetEntryProcessedGoalAssist2).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.Assist2PlayerId);

        entity.HasOne(d => d.Assist3Player).WithMany(p => p.ScoreSheetEntryProcessedGoalAssist3).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.Assist3PlayerId);
      });
      #endregion

      #region ScoreSheetEntryProcessedPenalty (PK, FK[1-N], column type)
      modelBuilder.Entity<ScoreSheetEntryProcessedPenalty>(entity =>
      {
        entity.ToTable("ScoreSheetEntryProcessedPenalties");

        entity.HasKey(x => new { x.ScoreSheetEntryPenaltyId });

        entity.HasOne(d => d.Season).WithMany(p => p.ScoreSheetEntryProcessedPenalties).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.SeasonId);

        entity.HasOne(d => d.Team).WithMany(p => p.ScoreSheetEntryProcessedPenalties).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.TeamId);

        entity.HasOne(d => d.Game).WithMany(p => p.ScoreSheetEntryProcessedPenalties).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.GameId);

        entity.HasOne(d => d.Player).WithMany(p => p.ScoreSheetEntryProcessedPenalties).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.PlayerId);

        entity.HasOne(d => d.Penalty).WithMany(p => p.ScoreSheetEntryProcessedPenalties).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.PenaltyId);
      });
      #endregion

      #region ScoreSheetEntryProcessedSub (PK, FK[1-N], column type)
      modelBuilder.Entity<ScoreSheetEntryProcessedSub>(entity =>
      {
        entity.ToTable("ScoreSheetEntryProcessedSubs");

        entity.HasKey(x => new { x.ScoreSheetEntrySubId });

        entity.HasOne(d => d.Season).WithMany(p => p.ScoreSheetEntryProcessedSubs).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.SeasonId);

        entity.HasOne(d => d.Team).WithMany(p => p.ScoreSheetEntryProcessedSubs).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.TeamId);

        entity.HasOne(d => d.Game).WithMany(p => p.ScoreSheetEntryProcessedSubs).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.GameId);

        entity.HasOne(d => d.SubPlayer).WithMany(p => p.ScoreSheetEntryProcessedSubPlayersSubbedFor).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.SubPlayerId);

        entity.HasOne(d => d.SubbingForPlayer).WithMany(p => p.ScoreSheetEntryProcessedSubPlayersSubbedForMe).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.SubbingForPlayerId);
      });
      #endregion

      #region ScoreSheetEntrySub (PK, FK[1-N])
      modelBuilder.Entity<ScoreSheetEntrySub>(entity =>
      {
        entity.ToTable("ScoreSheetEntrySubs");

        entity.HasKey(x => new { x.ScoreSheetEntrySubId });

        entity.HasOne(d => d.Game).WithMany(p => p.ScoreSheetEntrySubs).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.GameId);
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

      #region Setting (PK, PK2)
      modelBuilder.Entity<Setting>(entity =>
      {
        entity.ToTable("Settings");

        entity.HasKey(x => new { x.SettingId });

        entity.HasIndex(x => new { x.SettingName }).HasName("PK2").IsUnique();

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

        entity.HasOne(d => d.Coach).WithMany(p => p.TeamsCoached).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.CoachId);

        entity.HasOne(d => d.Sponsor).WithMany(p => p.TeamsSponsored).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.SponsorId);

        entity.HasOne(d => d.Division).WithMany(p => p.Teams).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.DivisionId);
      });
      #endregion

      #region TeamRoster (PK, FK[1-N])
      modelBuilder.Entity<TeamRoster>(entity =>
      {
        entity.ToTable("TeamRosters");

        entity.HasKey(x => new { x.TeamId, x.PlayerId, x.EndYYYYMMDD });

        entity.HasOne(d => d.Season).WithMany(p => p.TeamRosters).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.SeasonId);

        entity.HasOne(d => d.Team).WithMany(p => p.TeamRosters).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.TeamId);

        entity.HasOne(d => d.Player).WithMany(p => p.TeamRosters).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.PlayerId);
      });
      #endregion

      #region TeamStanding (PK, FK[1-N])
      modelBuilder.Entity<TeamStanding>(entity =>
      {
        entity.ToTable("TeamStandings");

        entity.HasKey(x => new { x.TeamId, x.Playoffs });

        entity.HasOne(d => d.Season).WithMany(p => p.TeamStandings).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.SeasonId);

        entity.HasOne(d => d.Team).WithMany(p => p.TeamStandings).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.TeamId);

        entity.HasOne(d => d.Division).WithMany(p => p.TeamStandings).OnDelete(DeleteBehavior.Restrict);
        entity.HasIndex(x => x.DivisionId);
      });
      #endregion
    }

    public DbSet<Division> Divisions { get; set; }
    public DbSet<Game> Games { get; set; }
    public DbSet<GameOutcome> GameOutcomes { get; set; }
    public DbSet<GameOutcomeOverride> GameOutcomeOverrides { get; set; }
    public DbSet<GameRoster> GameRosters { get; set; }
    public DbSet<GameScore> GameScores { get; set; }
    public DbSet<GameTeam> GameTeams { get; set; }
    public DbSet<GoalieStatCareer> GoalieStatCareers { get; set; }
    public DbSet<GoalieStatGame> GoalieStatGames { get; set; }
    public DbSet<GoalieStatSeason> GoalieStatSeasons { get; set; }
    public DbSet<GoalieStatTeam> GoalieStatTeams { get; set; }
    public DbSet<Penalty> Penalties { get; set; }
    public DbSet<Player> Players { get; set; }
    public DbSet<PlayerDraft> PlayerDrafts { get; set; }
    public DbSet<PlayerRating> PlayerRatings { get; set; }
    public DbSet<PlayerStatCareer> PlayerStatCareers { get; set; }
    public DbSet<PlayerStatGame> PlayerStatGames { get; set; }
    public DbSet<PlayerStatSeason> PlayerStatSeasons { get; set; }
    public DbSet<PlayerStatTeam> PlayerStatTeams { get; set; }
    public DbSet<PlayerStatus> PlayerStatuses { get; set; }
    public DbSet<PlayerStatusType> PlayerStatusTypes { get; set; }
    public DbSet<ScoreSheetEntryGoal> ScoreSheetEntryGoal { get; set; }
    public DbSet<ScoreSheetEntryPenalty> ScoreSheetEntryPenalties { get; set; }
    public DbSet<ScoreSheetEntryProcessedGame> ScoreSheetEntryProcessedGames { get; set; }
    public DbSet<ScoreSheetEntryProcessedGoal> ScoreSheetEntryProcessedGoals { get; set; }
    public DbSet<ScoreSheetEntryProcessedPenalty> ScoreSheetEntryProcessedPenalties { get; set; }
    public DbSet<ScoreSheetEntryProcessedSub> ScoreSheetEntryProcessedSubs { get; set; }
    public DbSet<ScoreSheetEntrySub> ScoreSheetEntrySub { get; set; }
    public DbSet<Season> Seasons { get; set; }
    public DbSet<Setting> Settings { get; set; }
    public DbSet<Team> Teams { get; set; }
    public DbSet<TeamRoster> TeamRosters { get; set; }
    public DbSet<TeamStanding> TeamStandings { get; set; }
  }
}