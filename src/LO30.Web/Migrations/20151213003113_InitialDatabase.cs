using System;
using System.Collections.Generic;
using Microsoft.Data.Entity.Migrations;
using Microsoft.Data.Entity.Metadata;

namespace LO30.Web.Migrations
{
    public partial class InitialDatabase : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Division",
                columns: table => new
                {
                    DivisionId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    DivisionLongName = table.Column<string>(nullable: false),
                    DivisionShortName = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Division", x => x.DivisionId);
                });
            migrationBuilder.CreateTable(
                name: "Player",
                columns: table => new
                {
                    PlayerId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    BirthDate = table.Column<DateTime>(nullable: true),
                    FirstName = table.Column<string>(nullable: false),
                    LastName = table.Column<string>(nullable: false),
                    PreferredPosition = table.Column<string>(nullable: false),
                    Profession = table.Column<string>(nullable: true),
                    Shoots = table.Column<string>(nullable: false),
                    Suffix = table.Column<string>(nullable: true),
                    WifesName = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Player", x => x.PlayerId);
                });
            migrationBuilder.CreateTable(
                name: "PlayerStatusType",
                columns: table => new
                {
                    PlayerStatusTypeId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    PlayerStatusTypeName = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlayerStatusType", x => x.PlayerStatusTypeId);
                });
            migrationBuilder.CreateTable(
                name: "Season",
                columns: table => new
                {
                    SeasonId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    EndYYYYMMDD = table.Column<int>(nullable: false),
                    IsCurrentSeason = table.Column<bool>(nullable: false),
                    SeasonName = table.Column<string>(nullable: false),
                    StartYYYYMMDD = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Season", x => x.SeasonId);
                });
            migrationBuilder.CreateTable(
                name: "PlayerStatCareer",
                columns: table => new
                {
                    PlayerId = table.Column<int>(nullable: false),
                    Assists = table.Column<int>(nullable: false),
                    GameWinningGoals = table.Column<int>(nullable: false),
                    Games = table.Column<int>(nullable: false),
                    Goals = table.Column<int>(nullable: false),
                    PenaltyMinutes = table.Column<int>(nullable: false),
                    Points = table.Column<int>(nullable: false),
                    PowerPlayGoals = table.Column<int>(nullable: false),
                    Seasons = table.Column<int>(nullable: false),
                    ShortHandedGoals = table.Column<int>(nullable: false),
                    UpdatedOn = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlayerStatCareer", x => x.PlayerId);
                    table.ForeignKey(
                        name: "FK_PlayerStatCareer_Player_PlayerId",
                        column: x => x.PlayerId,
                        principalTable: "Player",
                        principalColumn: "PlayerId",
                        onDelete: ReferentialAction.Cascade);
                });
            migrationBuilder.CreateTable(
                name: "PlayerStatus",
                columns: table => new
                {
                    PlayerId = table.Column<int>(nullable: false),
                    EventYYYYMMDD = table.Column<int>(nullable: false),
                    CurrentStatus = table.Column<bool>(nullable: false),
                    PlayerStatusTypeId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlayerStatus", x => new { x.PlayerId, x.EventYYYYMMDD });
                    table.UniqueConstraint("AK_PlayerStatus_PlayerId", x => x.PlayerId);
                    table.UniqueConstraint("AK_PlayerStatus_PlayerStatusTypeId", x => x.PlayerStatusTypeId);
                    table.ForeignKey(
                        name: "FK_PlayerStatus_Player_PlayerId",
                        column: x => x.PlayerId,
                        principalTable: "Player",
                        principalColumn: "PlayerId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PlayerStatus_PlayerStatusType_PlayerStatusTypeId",
                        column: x => x.PlayerStatusTypeId,
                        principalTable: "PlayerStatusType",
                        principalColumn: "PlayerStatusTypeId",
                        onDelete: ReferentialAction.Cascade);
                });
            migrationBuilder.CreateTable(
                name: "Game",
                columns: table => new
                {
                    GameId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    GameDateTime = table.Column<DateTime>(nullable: false),
                    GameYYYYMMDD = table.Column<int>(nullable: false),
                    Location = table.Column<string>(nullable: false),
                    Playoffs = table.Column<bool>(nullable: false),
                    SeasonId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Game", x => x.GameId);
                    table.UniqueConstraint("AK_Game_SeasonId", x => x.SeasonId);
                    table.ForeignKey(
                        name: "FK_Game_Season_SeasonId",
                        column: x => x.SeasonId,
                        principalTable: "Season",
                        principalColumn: "SeasonId",
                        onDelete: ReferentialAction.Cascade);
                });
            migrationBuilder.CreateTable(
                name: "PlayerStatSeason",
                columns: table => new
                {
                    PlayerId = table.Column<int>(nullable: false),
                    SeasonId = table.Column<int>(nullable: false),
                    Playoffs = table.Column<bool>(nullable: false),
                    Assists = table.Column<int>(nullable: false),
                    GameWinningGoals = table.Column<int>(nullable: false),
                    Games = table.Column<int>(nullable: false),
                    Goals = table.Column<int>(nullable: false),
                    PenaltyMinutes = table.Column<int>(nullable: false),
                    Points = table.Column<int>(nullable: false),
                    PowerPlayGoals = table.Column<int>(nullable: false),
                    ShortHandedGoals = table.Column<int>(nullable: false),
                    UpdatedOn = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlayerStatSeason", x => new { x.PlayerId, x.SeasonId, x.Playoffs });
                    table.UniqueConstraint("AK_PlayerStatSeason_PlayerId", x => x.PlayerId);
                    table.UniqueConstraint("AK_PlayerStatSeason_SeasonId", x => x.SeasonId);
                    table.ForeignKey(
                        name: "FK_PlayerStatSeason_Player_PlayerId",
                        column: x => x.PlayerId,
                        principalTable: "Player",
                        principalColumn: "PlayerId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PlayerStatSeason_Season_SeasonId",
                        column: x => x.SeasonId,
                        principalTable: "Season",
                        principalColumn: "SeasonId",
                        onDelete: ReferentialAction.Cascade);
                });
            migrationBuilder.CreateTable(
                name: "Team",
                columns: table => new
                {
                    TeamId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CoachId = table.Column<int>(nullable: true),
                    DivisionId = table.Column<int>(nullable: false),
                    SeasonId = table.Column<int>(nullable: false),
                    SponsorId = table.Column<int>(nullable: true),
                    TeamCode = table.Column<string>(nullable: false),
                    TeamNameLong = table.Column<string>(nullable: false),
                    TeamNameShort = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Team", x => x.TeamId);
                    table.UniqueConstraint("AK_Team_CoachId", x => x.CoachId);
                    table.UniqueConstraint("AK_Team_DivisionId", x => x.DivisionId);
                    table.UniqueConstraint("AK_Team_SeasonId", x => x.SeasonId);
                    table.UniqueConstraint("AK_Team_SponsorId", x => x.SponsorId);
                    table.ForeignKey(
                        name: "FK_Team_Player_CoachId",
                        column: x => x.CoachId,
                        principalTable: "Player",
                        principalColumn: "PlayerId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Team_Division_DivisionId",
                        column: x => x.DivisionId,
                        principalTable: "Division",
                        principalColumn: "DivisionId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Team_Season_SeasonId",
                        column: x => x.SeasonId,
                        principalTable: "Season",
                        principalColumn: "SeasonId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Team_Player_SponsorId",
                        column: x => x.SponsorId,
                        principalTable: "Player",
                        principalColumn: "PlayerId",
                        onDelete: ReferentialAction.Restrict);
                });
            migrationBuilder.CreateTable(
                name: "PlayerStatGame",
                columns: table => new
                {
                    PlayerId = table.Column<int>(nullable: false),
                    GameId = table.Column<int>(nullable: false),
                    Assists = table.Column<int>(nullable: false),
                    GameWinningGoals = table.Column<int>(nullable: false),
                    Goals = table.Column<int>(nullable: false),
                    Line = table.Column<int>(nullable: false),
                    PenaltyMinutes = table.Column<int>(nullable: false),
                    Playoffs = table.Column<bool>(nullable: false),
                    Points = table.Column<int>(nullable: false),
                    Position = table.Column<string>(nullable: false),
                    PowerPlayGoals = table.Column<int>(nullable: false),
                    SeasonId = table.Column<int>(nullable: false),
                    ShortHandedGoals = table.Column<int>(nullable: false),
                    Sub = table.Column<bool>(nullable: false),
                    TeamId = table.Column<int>(nullable: false),
                    UpdatedOn = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlayerStatGame", x => new { x.PlayerId, x.GameId });
                    table.UniqueConstraint("AK_PlayerStatGame_GameId", x => x.GameId);
                    table.UniqueConstraint("AK_PlayerStatGame_PlayerId", x => x.PlayerId);
                    table.UniqueConstraint("AK_PlayerStatGame_SeasonId", x => x.SeasonId);
                    table.UniqueConstraint("AK_PlayerStatGame_TeamId", x => x.TeamId);
                    table.ForeignKey(
                        name: "FK_PlayerStatGame_Game_GameId",
                        column: x => x.GameId,
                        principalTable: "Game",
                        principalColumn: "GameId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PlayerStatGame_Player_PlayerId",
                        column: x => x.PlayerId,
                        principalTable: "Player",
                        principalColumn: "PlayerId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PlayerStatGame_Season_SeasonId",
                        column: x => x.SeasonId,
                        principalTable: "Season",
                        principalColumn: "SeasonId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PlayerStatGame_Team_TeamId",
                        column: x => x.TeamId,
                        principalTable: "Team",
                        principalColumn: "TeamId",
                        onDelete: ReferentialAction.Cascade);
                });
            migrationBuilder.CreateTable(
                name: "PlayerStatTeam",
                columns: table => new
                {
                    PlayerId = table.Column<int>(nullable: false),
                    TeamId = table.Column<int>(nullable: false),
                    Playoffs = table.Column<bool>(nullable: false),
                    Sub = table.Column<bool>(nullable: false),
                    Assists = table.Column<int>(nullable: false),
                    GameWinningGoals = table.Column<int>(nullable: false),
                    Games = table.Column<int>(nullable: false),
                    Goals = table.Column<int>(nullable: false),
                    Line = table.Column<int>(nullable: false),
                    PenaltyMinutes = table.Column<int>(nullable: false),
                    Points = table.Column<int>(nullable: false),
                    Position = table.Column<string>(nullable: false),
                    PowerPlayGoals = table.Column<int>(nullable: false),
                    SeasonId = table.Column<int>(nullable: false),
                    ShortHandedGoals = table.Column<int>(nullable: false),
                    UpdatedOn = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlayerStatTeam", x => new { x.PlayerId, x.TeamId, x.Playoffs, x.Sub });
                    table.UniqueConstraint("AK_PlayerStatTeam_PlayerId", x => x.PlayerId);
                    table.UniqueConstraint("AK_PlayerStatTeam_SeasonId", x => x.SeasonId);
                    table.UniqueConstraint("AK_PlayerStatTeam_TeamId", x => x.TeamId);
                    table.ForeignKey(
                        name: "FK_PlayerStatTeam_Player_PlayerId",
                        column: x => x.PlayerId,
                        principalTable: "Player",
                        principalColumn: "PlayerId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PlayerStatTeam_Season_SeasonId",
                        column: x => x.SeasonId,
                        principalTable: "Season",
                        principalColumn: "SeasonId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PlayerStatTeam_Team_TeamId",
                        column: x => x.TeamId,
                        principalTable: "Team",
                        principalColumn: "TeamId",
                        onDelete: ReferentialAction.Cascade);
                });
            migrationBuilder.CreateIndex(
                name: "IX_Division_DivisionLongName",
                table: "Division",
                column: "DivisionLongName",
                unique: true);
            migrationBuilder.CreateIndex(
                name: "IX_Season_SeasonName",
                table: "Season",
                column: "SeasonName",
                unique: true);
            migrationBuilder.CreateIndex(
                name: "IX_Team_SeasonId_TeamCode",
                table: "Team",
                columns: new[] { "SeasonId", "TeamCode" },
                unique: true);
            migrationBuilder.CreateIndex(
                name: "IX_Team_SeasonId_TeamNameLong",
                table: "Team",
                columns: new[] { "SeasonId", "TeamNameLong" },
                unique: true);
            migrationBuilder.CreateIndex(
                name: "IX_Team_SeasonId_TeamNameShort",
                table: "Team",
                columns: new[] { "SeasonId", "TeamNameShort" },
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable("PlayerStatCareer");
            migrationBuilder.DropTable("PlayerStatGame");
            migrationBuilder.DropTable("PlayerStatSeason");
            migrationBuilder.DropTable("PlayerStatTeam");
            migrationBuilder.DropTable("PlayerStatus");
            migrationBuilder.DropTable("Game");
            migrationBuilder.DropTable("Team");
            migrationBuilder.DropTable("PlayerStatusType");
            migrationBuilder.DropTable("Player");
            migrationBuilder.DropTable("Division");
            migrationBuilder.DropTable("Season");
        }
    }
}
