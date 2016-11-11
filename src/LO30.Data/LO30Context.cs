using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace LO30.Data
{
  public class LO30DbContext : IdentityDbContext<ApplicationUser>
  {
    public LO30DbContext(DbContextOptions<LO30DbContext> options)
        : base(options)
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

      #region Division (PK, AK)
      modelBuilder.Entity<Division>(entity =>
      {
        entity.ToTable("Divisions");

        entity.HasKey(k => new { k.DivisionId });

        //entity.HasAlternateKey(ak => new { ak.DivisionShortName });  // TODO, ADD LATER AFTER CLEAN UP DATA
        entity.HasAlternateKey(ak => new { ak.DivisionLongName });
      });
      #endregion

      #region Game (PK, FK[1-N], column type)
      modelBuilder.Entity<Game>(entity =>
      {
        entity.ToTable("Games");

        entity.Property(p => p.GameDateTime).HasColumnType("smalldatetime");

        entity.HasKey(k => new { k.GameId });

        entity.HasOne(o => o.Season)
              .WithMany(m => m.Games)
              .HasForeignKey(fk => fk.SeasonId)
              .HasConstraintName("FK_Games_Seasons_SeasonId")
              .OnDelete(DeleteBehavior.Restrict);
      });
      #endregion

      #region GameOutcome (PK, AK, FK[1-N], column type)

      modelBuilder.Entity<GameOutcome>(entity =>
      {
        entity.ToTable("GameOutcomes");

        entity.HasKey(k => new { k.GameId, k.TeamId });

        entity.HasAlternateKey(ak => new { ak.GameId, ak.HomeTeam });

        entity.HasOne(o => o.Season)
              .WithMany(m => m.GameOutcomes)
              .HasForeignKey(fk => fk.SeasonId)
              .HasConstraintName("FK_GameOutcomes_Seasons_SeasonId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Team)
              .WithMany(m => m.GameOutcomes)
              .HasForeignKey(fk => fk.TeamId)
              .HasConstraintName("FK_GameOutcomes_Teams_TeamId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Game)
              .WithMany(m => m.GameOutcomes)
              .HasForeignKey(fk => fk.GameId)
              .HasConstraintName("FK_GameOutcomes_Games_GameId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.OpponentTeam)
              .WithMany(m => m.GameOutcomesOpponent)
              .HasForeignKey(fk => fk.OpponentTeamId)
              .HasConstraintName("FK_GameOutcomes_Teams_OpponentTeamId")
              .OnDelete(DeleteBehavior.Restrict);
      });
      #endregion

      #region GameOutcomeOverride (PK, FK[1-N])
      modelBuilder.Entity<GameOutcomeOverride>(entity =>
      {
        entity.ToTable("GameOutcomeOverrides");

        entity.HasKey(k => new { k.GameId, k.TeamId });

        entity.HasOne(o => o.Season)
              .WithMany(m => m.GameOutcomeOverrides)
              .HasForeignKey(fk => fk.SeasonId)
              .HasConstraintName("FK_GameOutcomeOverrides_Seasons_SeasonId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Team)
              .WithMany(m => m.GameOutcomeOverrides)
              .HasForeignKey(fk => fk.TeamId)
              .HasConstraintName("FK_GameOutcomeOverrides_Teams_TeamId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Game)
              .WithMany(m => m.GameOutcomeOverrides)
              .HasForeignKey(fk => fk.GameId)
              .HasConstraintName("FK_GameOutcomeOverrides_Games_GameId")
              .OnDelete(DeleteBehavior.Restrict);
      });
      #endregion

      #region GameRoster (PK, AKs, FK[1-N])
      modelBuilder.Entity<GameRoster>(entity =>
      {
        entity.ToTable("GameRosters");

        entity.HasKey(k => new { k.GameRosterId });

        entity.HasAlternateKey(ak => new { ak.GameId, ak.TeamId, ak.PlayerNumber });

        entity.HasAlternateKey(ak => new { ak.GameId, ak.TeamId, ak.PlayerId });

        entity.HasOne(o => o.Season)
              .WithMany(m => m.GameRosters)
              .HasForeignKey(fk => fk.SeasonId)
              .HasConstraintName("FK_GameRosters_Seasons_SeasonId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Team)
              .WithMany(m => m.GameRosters)
              .HasForeignKey(fk => fk.TeamId)
              .HasConstraintName("FK_GameRosters_Teams_TeamId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Game)
              .WithMany(m => m.GameRosters)
              .HasForeignKey(fk => fk.GameId)
              .HasConstraintName("FK_GameRosters_Games_GameId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Player)
              .WithMany(m => m.GameRosters)
              .HasForeignKey(fk => fk.PlayerId)
              .HasConstraintName("FK_GameRosters_Players_PlayerId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.SubbingForPlayer)
              .WithMany(m => m.GameRostersSubbedFor)
              .HasForeignKey(fk => fk.SubbingForPlayerId)
              .HasConstraintName("FK_GameRosters_Players_SubbingForPlayerId")
              .OnDelete(DeleteBehavior.Restrict);
      });
      #endregion

      #region GameScore (PK, FK[1-N])
      modelBuilder.Entity<GameScore>(entity =>
      {
        entity.ToTable("GameScores");

        entity.HasKey(k => new { k.GameId, k.TeamId, k.Period });

        entity.HasOne(o => o.Season)
              .WithMany(m => m.GameScores)
              .HasForeignKey(fk => fk.SeasonId)
              .HasConstraintName("FK_GameScores_Seasons_SeasonId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Team)
              .WithMany(m => m.GameScores)
              .HasForeignKey(fk => fk.TeamId)
              .HasConstraintName("FK_GameScores_Teams_TeamId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Game)
              .WithMany(m => m.GameScores)
              .HasForeignKey(fk => fk.GameId)
              .HasConstraintName("FK_GameScores_Games_GameId")
              .OnDelete(DeleteBehavior.Restrict);
      });
      #endregion

      #region GameTeam (PK, AK, FK[1-N])
      modelBuilder.Entity<GameTeam>(entity =>
      {
        entity.ToTable("GameTeams");

        entity.HasKey(k => new { k.GameId, k.TeamId });

        entity.HasAlternateKey(ak => new { ak.GameId, ak.HomeTeam });

        entity.HasOne(o => o.Season)
              .WithMany(m => m.GameTeams)
              .HasForeignKey(fk => fk.SeasonId)
              .HasConstraintName("FK_GameTeams_Seasons_SeasonId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Team)
              .WithMany(m => m.GameTeams)
              .HasForeignKey(fk => fk.TeamId)
              .HasConstraintName("FK_GameTeams_Teams_TeamId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Game)
              .WithMany(m => m.GameTeams)
              .HasForeignKey(fk => fk.GameId)
              .HasConstraintName("FK_GameTeams_Games_GameId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.OpponentTeam)
              .WithMany(m => m.GameTeamOpponents)
              .HasForeignKey(fk => fk.OpponentTeamId)
              .HasConstraintName("FK_GameTeams_Teams_OpponentTeamId")
              .OnDelete(DeleteBehavior.Restrict);
      });
      #endregion

      #region GoalieStatCareer (PK, FK[1-1], column type)
      modelBuilder.Entity<GoalieStatCareer>(entity =>
      {
        entity.ToTable("GoalieStatCareers");

        entity.HasKey(k => new { k.PlayerId });

        entity.HasOne(o => o.Player)
              .WithOne(o => o.GoalieStatCareer)
              .HasConstraintName("FK_GoalieStatCareer_Players_PlayerId")
              .OnDelete(DeleteBehavior.Restrict);
      });
      #endregion

      #region GoalieStatGame (PK, FK[1-N], column type)
      modelBuilder.Entity<GoalieStatGame>(entity =>
      {
        entity.ToTable("GoalieStatGames");

        entity.HasKey(k => new { k.PlayerId, k.GameId });

        entity.HasOne(o => o.Season)
              .WithMany(m => m.GoalieStatGames)
              .HasForeignKey(fk => fk.SeasonId)
              .HasConstraintName("FK_GoalieStatGames_Seasons_SeasonId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Team)
              .WithMany(m => m.GoalieStatGames)
              .HasForeignKey(fk => fk.TeamId)
              .HasConstraintName("FK_GoalieStatGames_Teams_TeamId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Game)
              .WithMany(m => m.GoalieStatGames)
              .HasForeignKey(fk => fk.GameId)
              .HasConstraintName("FK_GoalieStatGames_Games_GameId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Player)
              .WithMany(m => m.GoalieStatGames)
              .HasForeignKey(fk => fk.PlayerId)
              .HasConstraintName("FK_GoalieStatGames_Players_PlayerId")
              .OnDelete(DeleteBehavior.Restrict);
      });
      #endregion

      #region GoalieStatSeason (PK, FK[1-N], column type)
      modelBuilder.Entity<GoalieStatSeason>(entity =>
      {
        entity.ToTable("GoalieStatSeasons");

        entity.HasKey(k => new { k.PlayerId, k.SeasonId, k.Playoffs });

        entity.HasOne(o => o.Season)
              .WithMany(m => m.GoalieStatSeasons)
              .HasForeignKey(fk => fk.SeasonId)
              .HasConstraintName("FK_GoalieStatSeasons_Seasons_SeasonId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Player)
              .WithMany(m => m.GoalieStatSeasons)
              .HasForeignKey(fk => fk.PlayerId)
              .HasConstraintName("FK_GoalieStatSeasons_Players_PlayerId")
              .OnDelete(DeleteBehavior.Restrict);
      });
      #endregion

      #region GoalieStatTeam (PK, FK[1-N], column type)
      modelBuilder.Entity<GoalieStatTeam>(entity =>
      {
        entity.ToTable("GoalieStatTeams");

        entity.HasKey(k => new { k.PlayerId, k.TeamId, k.Playoffs, k.Sub });

        entity.HasOne(o => o.Season)
              .WithMany(m => m.GoalieStatTeams)
              .HasForeignKey(fk => fk.SeasonId)
              .HasConstraintName("FK_GoalieStatTeams_Seasons_SeasonId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Team)
              .WithMany(m => m.GoalieStatTeams)
              .HasForeignKey(fk => fk.TeamId)
              .HasConstraintName("FK_GoalieStatTeams_Teams_TeamId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Player)
              .WithMany(m => m.GoalieStatTeams)
              .HasForeignKey(fk => fk.PlayerId)
              .HasConstraintName("FK_GoalieStatTeams_Players_PlayerId")
              .OnDelete(DeleteBehavior.Restrict);
      });
      #endregion

      #region LineStatGame (PK, FK[1-N], column type)
      modelBuilder.Entity<LineStatGame>(entity =>
      {
        entity.ToTable("LineStatGames");

        entity.HasKey(k => new { k.GameId, k.TeamId, k.Line });

        entity.HasOne(o => o.Season)
              .WithMany(m => m.LineStatGames)
              .HasForeignKey(fk => fk.SeasonId)
              .HasConstraintName("FK_LineStatGames_Seasons_SeasonId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Team)
              .WithMany(m => m.LineStatGames)
              .HasForeignKey(fk => fk.TeamId)
              .HasConstraintName("FK_LineStatGames_Teams_TeamId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.OpponentTeam)
              .WithMany(m => m.LineStatGamesOpponentTeams)
              .HasForeignKey(fk => fk.OpponentTeamId)
              .HasConstraintName("FK_LineStatGames_Teams_OpponentTeamId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Game)
              .WithMany(m => m.LineStatGames)
              .HasForeignKey(fk => fk.GameId)
              .HasConstraintName("FK_LineStatGames_Games_GameId")
              .OnDelete(DeleteBehavior.Restrict);
      });
      #endregion

      #region LineStatSeason (PK, FK[1-N], column type)
      modelBuilder.Entity<LineStatSeason>(entity =>
      {
        entity.ToTable("LineStatSeasons");

        entity.HasKey(k => new { k.TeamId, k.Line, k.SeasonId, k.Playoffs });

        entity.HasOne(o => o.Season)
              .WithMany(m => m.LineStatSeasons)
              .HasForeignKey(fk => fk.SeasonId)
              .HasConstraintName("FK_LineStatSeasons_Seasons_SeasonId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Team)
              .WithMany(m => m.LineStatSeasons)
              .HasForeignKey(fk => fk.TeamId)
              .HasConstraintName("FK_LineStatSeasons_Teams_TeamId")
              .OnDelete(DeleteBehavior.Restrict);
      });
      #endregion

      #region LineStatTeam (PK, FK[1-N], column type)
      modelBuilder.Entity<LineStatTeam>(entity =>
      {
        entity.ToTable("LineStatTeams");

        entity.HasKey(k => new { k.TeamId, k.Line, k.OpponentTeamId, k.Playoffs });

        entity.HasOne(o => o.Season)
              .WithMany(m => m.LineStatTeams)
              .HasForeignKey(fk => fk.SeasonId)
              .HasConstraintName("FK_LineStatTeams_Seasons_SeasonId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Team)
              .WithMany(m => m.LineStatTeams)
              .HasForeignKey(fk => fk.TeamId)
              .HasConstraintName("FK_LineStatTeams_Teams_TeamId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.OpponentTeam)
              .WithMany(m => m.LineStatTeamsOpponentTeams)
              .HasForeignKey(fk => fk.OpponentTeamId)
              .HasConstraintName("FK_LineStatTeams_Teams_OpponentTeamId")
              .OnDelete(DeleteBehavior.Restrict);
      });
      #endregion

      #region Penalty (PK, AKs)
      modelBuilder.Entity<Penalty>(entity =>
      {
        entity.ToTable("Penalties");

        entity.HasKey(k => new { k.PenaltyId });

        entity.HasAlternateKey(ak => new { ak.PenaltyCode });

        entity.HasAlternateKey(ak => new { ak.PenaltyName });

      });
      #endregion

      #region Player (PK)
      modelBuilder.Entity<Player>(entity =>
      {
        entity.ToTable("Players");

        entity.HasKey(k => new { k.PlayerId });
      });
      #endregion

      #region PlayerDraft (PK, FK[1-N])
      modelBuilder.Entity<PlayerDraft>(entity =>
      {
        entity.ToTable("PlayerDrafts");

        entity.HasKey(k => new { k.SeasonId, k.PlayerId });

        entity.HasOne(o => o.Season)
              .WithMany(m => m.PlayerDrafts)
              .HasForeignKey(fk => fk.SeasonId)
              .HasConstraintName("FK_PlayerDrafts_Seasons_SeasonId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Player)
              .WithMany(m => m.PlayerDrafts)
              .HasForeignKey(fk => fk.PlayerId)
              .HasConstraintName("FK_PlayerDrafts_Players_PlayerId")
              .OnDelete(DeleteBehavior.Restrict);
      });
      #endregion

      #region PlayerRating (PK, FK[1-N])
      modelBuilder.Entity<PlayerRating>(entity =>
      {
        entity.ToTable("PlayerRatings");

        entity.HasKey(k => new { k.SeasonId, k.PlayerId, k.EndYYYYMMDD, k.Position });

        entity.HasOne(o => o.Season)
              .WithMany(m => m.PlayerRatings)
              .HasForeignKey(fk => fk.SeasonId)
              .HasConstraintName("FK_PlayerRatings_Seasons_SeasonId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Player)
              .WithMany(m => m.PlayerRatings)
              .HasForeignKey(fk => fk.PlayerId)
              .HasConstraintName("FK_PlayerRatings_Players_PlayerId")
              .OnDelete(DeleteBehavior.Restrict);
      });
      #endregion

      #region PlayerStatCareer (PK, FK[1-1], column type)
      modelBuilder.Entity<PlayerStatCareer>(entity =>
      {
        entity.ToTable("PlayerStatCareers");

        entity.HasKey(k => new { k.PlayerId });

        entity.HasOne(o => o.Player)
              .WithOne(m => m.PlayerStatCareer)
              .HasConstraintName("FK_PlayerStatCareers_Players_PlayerId")
              .OnDelete(DeleteBehavior.Restrict);
      });
      #endregion

      #region PlayerStatGame (PK, FK[1-N], column type)
      modelBuilder.Entity<PlayerStatGame>(entity =>
      {
        entity.ToTable("PlayerStatGames");

        entity.HasKey(k => new { k.PlayerId, k.GameId });

        entity.HasOne(o => o.Season)
              .WithMany(m => m.PlayerStatGames)
              .HasForeignKey(fk => fk.SeasonId)
              .HasConstraintName("FK_PlayerStatGames_Seasons_SeasonId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Team)
              .WithMany(m => m.PlayerStatGames)
              .HasForeignKey(fk => fk.TeamId)
              .HasConstraintName("FK_PlayerStatGames_Teams_TeamId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Game)
              .WithMany(m => m.PlayerStatGames)
              .HasForeignKey(fk => fk.GameId)
              .HasConstraintName("FK_PlayerStatGames_Games_GameId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Player)
              .WithMany(m => m.PlayerStatGames)
              .HasForeignKey(fk => fk.PlayerId)
              .HasConstraintName("FK_PlayerStatGames_Players_PlayerId")
              .OnDelete(DeleteBehavior.Restrict);
      });
      #endregion

      #region PlayerStatSeason (PK, FK[1-N], column type)
      modelBuilder.Entity<PlayerStatSeason>(entity =>
      {
        entity.ToTable("PlayerStatSeasons");

        entity.HasKey(k => new { k.PlayerId, k.SeasonId, k.Playoffs });

        entity.HasOne(o => o.Season)
              .WithMany(m => m.PlayerStatSeasons)
              .HasForeignKey(fk => fk.SeasonId)
              .HasConstraintName("FK_PlayerStatSeasons_Seasons_SeasonId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Player)
              .WithMany(m => m.PlayerStatSeasons)
              .HasForeignKey(fk => fk.PlayerId)
              .HasConstraintName("FK_PlayerStatSeasons_Players_PlayerId")
              .OnDelete(DeleteBehavior.Restrict);
      });
      #endregion

      #region PlayerStatTeam (PK, FK[1-N], column type)
      modelBuilder.Entity<PlayerStatTeam>(entity =>
      {
        entity.ToTable("PlayerStatTeams");

        entity.HasKey(k => new { k.PlayerId, k.TeamId, k.Playoffs, k.Sub });

        entity.HasOne(o => o.Season)
              .WithMany(m => m.PlayerStatTeams)
              .HasForeignKey(fk => fk.SeasonId)
              .HasConstraintName("FK_PlayerStatTeams_Seasons_SeasonId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Team)
              .WithMany(m => m.PlayerStatTeams)
              .HasForeignKey(fk => fk.TeamId)
              .HasConstraintName("FK_PlayerStatTeams_Teams_TeamId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Player)
              .WithMany(m => m.PlayerStatTeams)
              .HasForeignKey(fk => fk.PlayerId)
              .HasConstraintName("FK_PlayerStatTeams_Players_PlayerId")
              .OnDelete(DeleteBehavior.Restrict);
      });
      #endregion

      #region PlayerStatus (PK, FK[1-N])
      modelBuilder.Entity<PlayerStatus>(entity =>
      {
        entity.ToTable("PlayerStatuses");

        entity.HasKey(k => new { k.PlayerId, k.EventYYYYMMDD });

        entity.HasOne(o => o.PlayerStatusType)
              .WithMany(m => m.PlayerStatuses)
              .HasForeignKey(fk => fk.PlayerStatusTypeId)
              .HasConstraintName("FK_PlayerStatuses_PlayerStatusTypes_PlayerStatusTypeId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Player)
              .WithMany(m => m.PlayerStatuses)
              .HasForeignKey(fk => fk.PlayerId)
              .HasConstraintName("FK_PlayerStatuses_Players_PlayerId")
              .OnDelete(DeleteBehavior.Restrict);
      });
      #endregion

      #region PlayerStatusType (PK, PK2)
      modelBuilder.Entity<PlayerStatusType>(entity =>
      {
        entity.ToTable("PlayerStatusTypes");

        entity.HasKey(k => new { k.PlayerStatusTypeId });

        entity.HasAlternateKey(ak => new { ak.PlayerStatusTypeName });

      });
      #endregion

      #region ScoreSheetEntryGoal (PK, FK[1-N])
      modelBuilder.Entity<ScoreSheetEntryGoal>(entity =>
      {
        entity.ToTable("ScoreSheetEntryGoals");

        entity.HasKey(k => new { k.ScoreSheetEntryGoalId });

        entity.HasOne(o => o.Game)
              .WithMany(m => m.ScoreSheetEntryGoals)
              .HasForeignKey(fk => fk.GameId)
              .HasConstraintName("FK_ScoreSheetEntryGoals_Games_GameId")
              .OnDelete(DeleteBehavior.Restrict);
      });
      #endregion

      #region ScoreSheetEntryPenalty (PK, FK[1-N])
      modelBuilder.Entity<ScoreSheetEntryPenalty>(entity =>
      {
        entity.ToTable("ScoreSheetEntryPenalties");

        entity.HasKey(k => new { k.ScoreSheetEntryPenaltyId });

        entity.HasOne(o => o.Game)
              .WithMany(m => m.ScoreSheetEntryPenalties)
              .HasForeignKey(fk => fk.GameId)
              .HasConstraintName("FK_ScoreSheetEntryPenalties_Games_GameId")
              .OnDelete(DeleteBehavior.Restrict);
      });
      #endregion

      #region ScoreSheetEntryProcessedGame (PK, FK[1-N], column type)
      modelBuilder.Entity<ScoreSheetEntryProcessedGame>(entity =>
      {
        entity.ToTable("ScoreSheetEntryProcessedGames");

        entity.HasKey(k => new { k.GameId });

        entity.HasOne(o => o.Game)
              .WithMany(m => m.ScoreSheetEntryProcessedGames)
              .HasForeignKey(fk => fk.GameId)
              .HasConstraintName("FK_ScoreSheetEntryProcessedGames_Games_GameId")
              .OnDelete(DeleteBehavior.Restrict);
      });
      #endregion

      #region ScoreSheetEntryProcessedGoal (PK, FK[1-N], column type)
      modelBuilder.Entity<ScoreSheetEntryProcessedGoal>(entity =>
      {
        entity.ToTable("ScoreSheetEntryProcessedGoals");

        entity.HasKey(k => new { k.ScoreSheetEntryGoalId });

        entity.HasOne(o => o.Season)
              .WithMany(m => m.ScoreSheetEntryProcessedGoals)
              .HasForeignKey(fk => fk.SeasonId)
              .HasConstraintName("FK_ScoreSheetEntryProcessedGoals_Seasons_SeasonId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Team)
              .WithMany(m => m.ScoreSheetEntryProcessedGoals)
              .HasForeignKey(fk => fk.TeamId)
              .HasConstraintName("FK_ScoreSheetEntryProcessedGoals_Teams_TeamId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Game)
              .WithMany(m => m.ScoreSheetEntryProcessedGoals)
              .HasForeignKey(fk => fk.GameId)
              .HasConstraintName("FK_ScoreSheetEntryProcessedGoals_Games_GameId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.GoalPlayer)
              .WithMany(m => m.ScoreSheetEntryProcessedGoalGoals)
              .HasForeignKey(fk => fk.GoalPlayerId)
              .HasConstraintName("FK_ScoreSheetEntryProcessedGoals_Players_GoalPlayerId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Assist1Player)
              .WithMany(m => m.ScoreSheetEntryProcessedGoalAssist1)
              .HasForeignKey(fk => fk.Assist1PlayerId)
              .HasConstraintName("FK_ScoreSheetEntryProcessedGoals_Players_Assist1PlayerId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Assist2Player)
              .WithMany(m => m.ScoreSheetEntryProcessedGoalAssist2)
              .HasForeignKey(fk => fk.Assist2PlayerId)
              .HasConstraintName("FK_ScoreSheetEntryProcessedGoals_Players_Assist2PlayerId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Assist3Player)
              .WithMany(m => m.ScoreSheetEntryProcessedGoalAssist3)
              .HasForeignKey(fk => fk.Assist3PlayerId)
              .HasConstraintName("FK_ScoreSheetEntryProcessedGoals_Players_Assist3PlayerId")
              .OnDelete(DeleteBehavior.Restrict);
      });
      #endregion

      #region ScoreSheetEntryProcessedLinePlusMinus (PK, FK[1-N], column type)
      modelBuilder.Entity<ScoreSheetEntryProcessedLinePlusMinus>(entity =>
      {
        entity.ToTable("ScoreSheetEntryProcessedLinePlusMinuses");

        entity.HasKey(k => new { k.ScoreSheetEntryGoalId });

        entity.HasOne(o => o.Season)
              .WithMany(m => m.ScoreSheetEntryProcessedLinePlusMinuses)
              .HasForeignKey(fk => fk.SeasonId)
              .HasConstraintName("FK_ScoreSheetEntryProcessedLinePlusMinuses_Seasons_SeasonId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Team)
              .WithMany(m => m.ScoreSheetEntryProcessedLinePlusMinuses)
              .HasForeignKey(fk => fk.TeamId)
              .HasConstraintName("FK_ScoreSheetEntryProcessedLinePlusMinuses_Teams_TeamId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Game)
              .WithMany(m => m.ScoreSheetEntryProcessedLinePlusMinuses)
              .HasForeignKey(fk => fk.GameId)
              .HasConstraintName("FK_ScoreSheetEntryProcessedLinePlusMinuses_Games_GameId")
              .OnDelete(DeleteBehavior.Restrict);
      });
      #endregion

      #region ScoreSheetEntryProcessedPenalty (PK, FK[1-N], column type)
      modelBuilder.Entity<ScoreSheetEntryProcessedPenalty>(entity =>
      {
        entity.ToTable("ScoreSheetEntryProcessedPenalties");

        entity.HasKey(k => new { k.ScoreSheetEntryPenaltyId });

        entity.HasOne(o => o.Season)
              .WithMany(m => m.ScoreSheetEntryProcessedPenalties)
              .HasForeignKey(fk => fk.SeasonId)
              .HasConstraintName("FK_ScoreSheetEntryProcessedPenalties_Seasons_SeasonId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Team)
              .WithMany(m => m.ScoreSheetEntryProcessedPenalties)
              .HasForeignKey(fk => fk.TeamId)
              .HasConstraintName("FK_ScoreSheetEntryProcessedPenalties_Teams_TeamId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Game)
              .WithMany(m => m.ScoreSheetEntryProcessedPenalties)
              .HasForeignKey(fk => fk.GameId)
              .HasConstraintName("FK_ScoreSheetEntryProcessedPenalties_Games_GameId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Player)
              .WithMany(m => m.ScoreSheetEntryProcessedPenalties)
              .HasForeignKey(fk => fk.PlayerId)
              .HasConstraintName("FK_ScoreSheetEntryProcessedPenalties_Players_PlayerId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Penalty)
              .WithMany(m => m.ScoreSheetEntryProcessedPenalties)
              .HasForeignKey(fk => fk.PenaltyId)
              .HasConstraintName("FK_ScoreSheetEntryProcessedPenalties_Penalties_PenaltyId")
              .OnDelete(DeleteBehavior.Restrict);
      });
      #endregion

      #region ScoreSheetEntryProcessedSub (PK, FK[1-N], column type)
      modelBuilder.Entity<ScoreSheetEntryProcessedSub>(entity =>
      {
        entity.ToTable("ScoreSheetEntryProcessedSubs");

        entity.HasKey(k => new { k.ScoreSheetEntrySubId });

        entity.HasOne(o => o.Season)
              .WithMany(m => m.ScoreSheetEntryProcessedSubs)
              .HasForeignKey(fk => fk.SeasonId)
              .HasConstraintName("FK_ScoreSheetEntryProcessedSubs_Seasons_SeasonId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Team)
              .WithMany(m => m.ScoreSheetEntryProcessedSubs)
              .HasForeignKey(fk => fk.TeamId)
              .HasConstraintName("FK_ScoreSheetEntryProcessedSubs_Teams_TeamId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Game)
              .WithMany(m => m.ScoreSheetEntryProcessedSubs)
              .HasForeignKey(fk => fk.GameId)
              .HasConstraintName("FK_ScoreSheetEntryProcessedSubs_Games_GameId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.SubPlayer)
              .WithMany(m => m.ScoreSheetEntryProcessedSubPlayersSubbedFor)
              .HasForeignKey(fk => fk.SubPlayerId)
              .HasConstraintName("FK_ScoreSheetEntryProcessedSubs_Players_SubPlayerId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.SubbingForPlayer)
              .WithMany(m => m.ScoreSheetEntryProcessedSubPlayersSubbedForMe)
              .HasForeignKey(fk => fk.SubbingForPlayerId)
              .HasConstraintName("FK_ScoreSheetEntryProcessedSubs_Players_SubbingForPlayerId")
              .OnDelete(DeleteBehavior.Restrict);
      });
      #endregion

      #region ScoreSheetEntrySub (PK, FK[1-N])
      modelBuilder.Entity<ScoreSheetEntrySub>(entity =>
      {
        entity.ToTable("ScoreSheetEntrySubs");

        entity.HasKey(k => new { k.ScoreSheetEntrySubId });

        entity.HasOne(o => o.Game)
              .WithMany(m => m.ScoreSheetEntrySubs)
              .HasForeignKey(fk => fk.GameId)
              .HasConstraintName("FK_ScoreSheetEntrySubs_Games_GameId")
              .OnDelete(DeleteBehavior.Restrict);

      });
      #endregion

      #region Season (PK, AK)
      modelBuilder.Entity<Season>(entity =>
      {
        entity.ToTable("Seasons");

        entity.HasKey(k => new { k.SeasonId });

        entity.HasAlternateKey(ak => new { ak.SeasonName });
      });
      #endregion

      #region Setting (PK, AK)
      modelBuilder.Entity<Setting>(entity =>
      {
        entity.ToTable("Settings");

        entity.HasKey(k => new { k.SettingId });

        entity.HasAlternateKey(ak => new { ak.SettingName });
      });
      #endregion

      #region Team (PK, AKs, FK[1-N])
      modelBuilder.Entity<Team>(entity =>
      {
        entity.ToTable("Teams");

        entity.HasKey(k => new { k.TeamId });

        entity.HasAlternateKey(ak => new { ak.SeasonId, ak.TeamCode });
        entity.HasAlternateKey(ak => new { ak.SeasonId, ak.TeamNameShort });
        entity.HasAlternateKey(ak => new { ak.SeasonId, ak.TeamNameLong });

        entity.HasOne(o => o.Season)
              .WithMany(m => m.Teams)
              .HasForeignKey(fk => fk.SeasonId)
              .HasConstraintName("FK_Teams_Seasons_SeasonId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Coach)
              .WithMany(m => m.TeamsCoached)
              .HasForeignKey(fk => fk.CoachId)
              .HasConstraintName("FK_Teams_Players_CoachId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Sponsor)
              .WithMany(m => m.TeamsSponsored)
              .HasForeignKey(fk => fk.SponsorId)
              .HasConstraintName("FK_Teams_Players_SponsorId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Division)
              .WithMany(m => m.Teams)
              .HasForeignKey(fk => fk.DivisionId)
              .HasConstraintName("FK_Teams_Divisions_DivisionId")
              .OnDelete(DeleteBehavior.Restrict);
      });
      #endregion

      #region TeamRoster (PK, FK[1-N])
      modelBuilder.Entity<TeamRoster>(entity =>
      {
        entity.ToTable("TeamRosters");

        entity.HasKey(k => new { k.TeamId, k.PlayerId, k.EndYYYYMMDD });

        entity.HasOne(o => o.Season)
              .WithMany(m => m.TeamRosters)
              .HasForeignKey(fk => fk.SeasonId)
              .HasConstraintName("FK_TeamRosters_Seasons_SeasonId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Team)
              .WithMany(m => m.TeamRosters)
              .HasForeignKey(fk => fk.TeamId)
              .HasConstraintName("FK_TeamRosters_Teams_TeamId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Player)
              .WithMany(m => m.TeamRosters)
              .HasForeignKey(fk => fk.PlayerId)
              .HasConstraintName("FK_TeamRosters_Players_PlayerId")
              .OnDelete(DeleteBehavior.Restrict);
      });
      #endregion

      #region TeamStanding (PK, FK[1-N])
      modelBuilder.Entity<TeamStanding>(entity =>
      {
        entity.ToTable("TeamStandings");

        entity.HasKey(k => new { k.TeamId, k.Playoffs });

        entity.HasOne(o => o.Season)
              .WithMany(m => m.TeamStandings)
              .HasForeignKey(fk => fk.SeasonId)
              .HasConstraintName("FK_TeamStandings_Seasons_SeasonId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Team)
              .WithMany(m => m.TeamStandings)
              .HasForeignKey(fk => fk.TeamId)
              .HasConstraintName("FK_TeamStandings_Teams_TeamId")
              .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(o => o.Division)
              .WithMany(m => m.TeamStandings)
              .HasForeignKey(fk => fk.DivisionId)
              .HasConstraintName("FK_TeamStandings_Divisions_DivisionId")
              .OnDelete(DeleteBehavior.Restrict);
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
    public DbSet<LineStatGame> LineStatGames { get; set; }
    public DbSet<LineStatSeason> LineStatSeasons { get; set; }
    public DbSet<LineStatTeam> LineStatTeams { get; set; }
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
    public DbSet<ScoreSheetEntryGoal> ScoreSheetEntryGoals { get; set; }
    public DbSet<ScoreSheetEntryPenalty> ScoreSheetEntryPenalties { get; set; }
    public DbSet<ScoreSheetEntryProcessedGame> ScoreSheetEntryProcessedGames { get; set; }
    public DbSet<ScoreSheetEntryProcessedGoal> ScoreSheetEntryProcessedGoals { get; set; }
    public DbSet<ScoreSheetEntryProcessedLinePlusMinus> ScoreSheetEntryProcessedLinePlusMinuses { get; set; }
    public DbSet<ScoreSheetEntryProcessedPenalty> ScoreSheetEntryProcessedPenalties { get; set; }
    public DbSet<ScoreSheetEntryProcessedSub> ScoreSheetEntryProcessedSubs { get; set; }
    public DbSet<ScoreSheetEntrySub> ScoreSheetEntrySubs { get; set; }
    public DbSet<Season> Seasons { get; set; }
    public DbSet<Setting> Settings { get; set; }
    public DbSet<Team> Teams { get; set; }
    public DbSet<TeamRoster> TeamRosters { get; set; }
    public DbSet<TeamStanding> TeamStandings { get; set; }
  }
}