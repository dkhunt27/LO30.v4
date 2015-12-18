using System;
using Microsoft.Data.Entity;
using Microsoft.Data.Entity.Infrastructure;
using Microsoft.Data.Entity.Metadata;
using Microsoft.Data.Entity.Migrations;
using LO30.Web.Models.Context;

namespace LO30.Web.Migrations
{
    [DbContext(typeof(LO30DbContext))]
    [Migration("20151213003113_InitialDatabase")]
    partial class InitialDatabase
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.0-rc1-16348")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("LO30.Web.Models.Objects.Division", b =>
                {
                    b.Property<int>("DivisionId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("DivisionLongName")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 50);

                    b.Property<string>("DivisionShortName")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 15);

                    b.HasKey("DivisionId");

                    b.HasIndex("DivisionLongName")
                        .IsUnique();
                });

            modelBuilder.Entity("LO30.Web.Models.Objects.Game", b =>
                {
                    b.Property<int>("GameId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("GameDateTime");

                    b.Property<int>("GameYYYYMMDD");

                    b.Property<string>("Location")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 15);

                    b.Property<bool>("Playoffs");

                    b.Property<int>("SeasonId");

                    b.HasKey("GameId");

                    b.HasAlternateKey("SeasonId");
                });

            modelBuilder.Entity("LO30.Web.Models.Objects.Player", b =>
                {
                    b.Property<int>("PlayerId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("BirthDate");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 35);

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 35);

                    b.Property<string>("PreferredPosition")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 1);

                    b.Property<string>("Profession");

                    b.Property<string>("Shoots")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 1);

                    b.Property<string>("Suffix")
                        .HasAnnotation("MaxLength", 5);

                    b.Property<string>("WifesName");

                    b.HasKey("PlayerId");
                });

            modelBuilder.Entity("LO30.Web.Models.Objects.PlayerStatCareer", b =>
                {
                    b.Property<int>("PlayerId");

                    b.Property<int>("Assists");

                    b.Property<int>("GameWinningGoals");

                    b.Property<int>("Games");

                    b.Property<int>("Goals");

                    b.Property<int>("PenaltyMinutes");

                    b.Property<int>("Points");

                    b.Property<int>("PowerPlayGoals");

                    b.Property<int>("Seasons");

                    b.Property<int>("ShortHandedGoals");

                    b.Property<DateTime>("UpdatedOn");

                    b.HasKey("PlayerId");
                });

            modelBuilder.Entity("LO30.Web.Models.Objects.PlayerStatGame", b =>
                {
                    b.Property<int>("PlayerId");

                    b.Property<int>("GameId");

                    b.Property<int>("Assists");

                    b.Property<int>("GameWinningGoals");

                    b.Property<int>("Goals");

                    b.Property<int>("Line");

                    b.Property<int>("PenaltyMinutes");

                    b.Property<bool>("Playoffs");

                    b.Property<int>("Points");

                    b.Property<string>("Position")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 1);

                    b.Property<int>("PowerPlayGoals");

                    b.Property<int>("SeasonId");

                    b.Property<int>("ShortHandedGoals");

                    b.Property<bool>("Sub");

                    b.Property<int>("TeamId");

                    b.Property<DateTime>("UpdatedOn");

                    b.HasKey("PlayerId", "GameId");

                    b.HasAlternateKey("GameId");


                    b.HasAlternateKey("PlayerId");


                    b.HasAlternateKey("SeasonId");


                    b.HasAlternateKey("TeamId");
                });

            modelBuilder.Entity("LO30.Web.Models.Objects.PlayerStatSeason", b =>
                {
                    b.Property<int>("PlayerId");

                    b.Property<int>("SeasonId");

                    b.Property<bool>("Playoffs");

                    b.Property<int>("Assists");

                    b.Property<int>("GameWinningGoals");

                    b.Property<int>("Games");

                    b.Property<int>("Goals");

                    b.Property<int>("PenaltyMinutes");

                    b.Property<int>("Points");

                    b.Property<int>("PowerPlayGoals");

                    b.Property<int>("ShortHandedGoals");

                    b.Property<DateTime>("UpdatedOn");

                    b.HasKey("PlayerId", "SeasonId", "Playoffs");

                    b.HasAlternateKey("PlayerId");


                    b.HasAlternateKey("SeasonId");
                });

            modelBuilder.Entity("LO30.Web.Models.Objects.PlayerStatTeam", b =>
                {
                    b.Property<int>("PlayerId");

                    b.Property<int>("TeamId");

                    b.Property<bool>("Playoffs");

                    b.Property<bool>("Sub");

                    b.Property<int>("Assists");

                    b.Property<int>("GameWinningGoals");

                    b.Property<int>("Games");

                    b.Property<int>("Goals");

                    b.Property<int>("Line");

                    b.Property<int>("PenaltyMinutes");

                    b.Property<int>("Points");

                    b.Property<string>("Position")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 1);

                    b.Property<int>("PowerPlayGoals");

                    b.Property<int>("SeasonId");

                    b.Property<int>("ShortHandedGoals");

                    b.Property<DateTime>("UpdatedOn");

                    b.HasKey("PlayerId", "TeamId", "Playoffs", "Sub");

                    b.HasAlternateKey("PlayerId");


                    b.HasAlternateKey("SeasonId");


                    b.HasAlternateKey("TeamId");
                });

            modelBuilder.Entity("LO30.Web.Models.Objects.PlayerStatus", b =>
                {
                    b.Property<int>("PlayerId");

                    b.Property<int>("EventYYYYMMDD");

                    b.Property<bool>("CurrentStatus");

                    b.Property<int>("PlayerStatusTypeId");

                    b.HasKey("PlayerId", "EventYYYYMMDD");

                    b.HasAlternateKey("PlayerId");


                    b.HasAlternateKey("PlayerStatusTypeId");
                });

            modelBuilder.Entity("LO30.Web.Models.Objects.PlayerStatusType", b =>
                {
                    b.Property<int>("PlayerStatusTypeId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("PlayerStatusTypeName")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 25);

                    b.HasKey("PlayerStatusTypeId");
                });

            modelBuilder.Entity("LO30.Web.Models.Objects.Season", b =>
                {
                    b.Property<int>("SeasonId")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("EndYYYYMMDD");

                    b.Property<bool>("IsCurrentSeason");

                    b.Property<string>("SeasonName")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 12);

                    b.Property<int>("StartYYYYMMDD");

                    b.HasKey("SeasonId");

                    b.HasIndex("SeasonName")
                        .IsUnique();
                });

            modelBuilder.Entity("LO30.Web.Models.Objects.Team", b =>
                {
                    b.Property<int>("TeamId")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("CoachId");

                    b.Property<int>("DivisionId");

                    b.Property<int>("SeasonId");

                    b.Property<int?>("SponsorId");

                    b.Property<string>("TeamCode")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 5);

                    b.Property<string>("TeamNameLong")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 35);

                    b.Property<string>("TeamNameShort")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 15);

                    b.HasKey("TeamId");

                    b.HasAlternateKey("CoachId");


                    b.HasAlternateKey("DivisionId");


                    b.HasAlternateKey("SeasonId");


                    b.HasAlternateKey("SponsorId");

                    b.HasIndex("SeasonId", "TeamCode")
                        .IsUnique();

                    b.HasIndex("SeasonId", "TeamNameLong")
                        .IsUnique();

                    b.HasIndex("SeasonId", "TeamNameShort")
                        .IsUnique();
                });

            modelBuilder.Entity("LO30.Web.Models.Objects.Game", b =>
                {
                    b.HasOne("LO30.Web.Models.Objects.Season")
                        .WithMany()
                        .HasForeignKey("SeasonId");
                });

            modelBuilder.Entity("LO30.Web.Models.Objects.PlayerStatCareer", b =>
                {
                    b.HasOne("LO30.Web.Models.Objects.Player")
                        .WithMany()
                        .HasForeignKey("PlayerId");
                });

            modelBuilder.Entity("LO30.Web.Models.Objects.PlayerStatGame", b =>
                {
                    b.HasOne("LO30.Web.Models.Objects.Game")
                        .WithMany()
                        .HasForeignKey("GameId");

                    b.HasOne("LO30.Web.Models.Objects.Player")
                        .WithMany()
                        .HasForeignKey("PlayerId");

                    b.HasOne("LO30.Web.Models.Objects.Season")
                        .WithMany()
                        .HasForeignKey("SeasonId");

                    b.HasOne("LO30.Web.Models.Objects.Team")
                        .WithMany()
                        .HasForeignKey("TeamId");
                });

            modelBuilder.Entity("LO30.Web.Models.Objects.PlayerStatSeason", b =>
                {
                    b.HasOne("LO30.Web.Models.Objects.Player")
                        .WithMany()
                        .HasForeignKey("PlayerId");

                    b.HasOne("LO30.Web.Models.Objects.Season")
                        .WithMany()
                        .HasForeignKey("SeasonId");
                });

            modelBuilder.Entity("LO30.Web.Models.Objects.PlayerStatTeam", b =>
                {
                    b.HasOne("LO30.Web.Models.Objects.Player")
                        .WithMany()
                        .HasForeignKey("PlayerId");

                    b.HasOne("LO30.Web.Models.Objects.Season")
                        .WithMany()
                        .HasForeignKey("SeasonId");

                    b.HasOne("LO30.Web.Models.Objects.Team")
                        .WithMany()
                        .HasForeignKey("TeamId");
                });

            modelBuilder.Entity("LO30.Web.Models.Objects.PlayerStatus", b =>
                {
                    b.HasOne("LO30.Web.Models.Objects.Player")
                        .WithMany()
                        .HasForeignKey("PlayerId");

                    b.HasOne("LO30.Web.Models.Objects.PlayerStatusType")
                        .WithMany()
                        .HasForeignKey("PlayerStatusTypeId");
                });

            modelBuilder.Entity("LO30.Web.Models.Objects.Team", b =>
                {
                    b.HasOne("LO30.Web.Models.Objects.Player")
                        .WithMany()
                        .HasForeignKey("CoachId");

                    b.HasOne("LO30.Web.Models.Objects.Division")
                        .WithMany()
                        .HasForeignKey("DivisionId");

                    b.HasOne("LO30.Web.Models.Objects.Season")
                        .WithMany()
                        .HasForeignKey("SeasonId");

                    b.HasOne("LO30.Web.Models.Objects.Player")
                        .WithMany()
                        .HasForeignKey("SponsorId");
                });
        }
    }
}
