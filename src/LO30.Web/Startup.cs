using AutoMapper;
using LO30.Data;
using LO30.Data.Services;
using LO30.Web.Services;
using LO30.Web.ViewModels.Api;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Serialization;
using System.Linq;

namespace LO30.Web
{
  public class Startup
  {
    public IConfigurationRoot Configuration { get; set; }

    public Startup(IHostingEnvironment env)
    {
      var builder = new ConfigurationBuilder()
          .SetBasePath(env.ContentRootPath)
          .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
          .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
          .AddEnvironmentVariables();

      if (env.IsDevelopment())
      {
        // This will push telemetry data through Application Insights pipeline faster, allowing you to view results immediately.
        builder.AddApplicationInsightsSettings(developerMode: true);
      }
      Configuration = builder.Build();
    }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
      string lo30DbConnString = Configuration["Data:ConnectionString:LO30Db"];

      // Add framework services.
      services.AddApplicationInsightsTelemetry(Configuration);

      // http://andrewlock.net/an-introduction-to-session-storage-in-asp-net-core/
      services.AddDistributedMemoryCache();
      services.AddSession();

      services.AddDbContext<LO30DbContext>(opt => opt.UseSqlServer(lo30DbConnString));

      services.AddIdentity<ApplicationUser, IdentityRole>()
          .AddEntityFrameworkStores<LO30DbContext>()
          .AddDefaultTokenProviders();

      services.AddMvc()
        .AddJsonOptions(opt =>
        {
          opt.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
        });

      // Add application services.
      // https://weblog.west-wind.com/posts/2016/May/23/Strongly-Typed-Configuration-Settings-in-ASPNET-Core

      // Add functionality to inject IOptions<T>
      services.AddOptions();

      // cant get the extension to load Microsoft.Extensions.Options.ConfigurationExtensions
      //services.Configure<MySettings>(Configuration.GetSection("MySettings"));


      // *If* you need access to generic IConfiguration this is **required**
      //services.AddSingleton<MySettings>(Configuration);

      services.AddTransient<IEmailSender, AuthMessageSender>();
      services.AddTransient<ISmsSender, AuthMessageSender>();
      services.AddTransient<PlayerNameService, PlayerNameService>();
      services.AddTransient<IPlayersService, PlayersService>();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
    {
      loggerFactory.AddConsole(Configuration.GetSection("Logging"));
      loggerFactory.AddDebug();

      app.UseApplicationInsightsRequestTelemetry();

      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
        app.UseBrowserLink();
        app.UseDatabaseErrorPage();
      }
      else
      {
        app.UseExceptionHandler("/Home/Error");

        // For more details on creating database during deployment see http://go.microsoft.com/fwlink/?LinkID=615859
        try
        {
          using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>()
              .CreateScope())
          {
            serviceScope.ServiceProvider.GetService<LO30DbContext>()
                 .Database.Migrate();
          }
        }
        catch { }
      }

      app.UseApplicationInsightsExceptionTelemetry();

      app.UseSession();

      app.UseStaticFiles();

      app.UseIdentity();

      Mapper.Initialize(config =>
      {
        config.CreateMap<Game, GameCompositeViewModel>()
              .ForMember(vm => vm.SeasonName, opt => opt.MapFrom(m => m.Season.SeasonName))

              // TODO, more research...Team isn't getting populated, but opponentteam is
              .ForMember(vm => vm.TeamIdAway, opt => opt.MapFrom(m => m.GameTeams.Where(y => y.HomeTeam == true).Single().OpponentTeam.TeamId))
              .ForMember(vm => vm.TeamCodeAway, opt => opt.MapFrom(m => m.GameTeams.Where(y => y.HomeTeam == true).Single().OpponentTeam.TeamCode))
              .ForMember(vm => vm.TeamNameLongAway, opt => opt.MapFrom(m => m.GameTeams.Where(y => y.HomeTeam == true).Single().OpponentTeam.TeamNameLong))
              .ForMember(vm => vm.TeamNameShortAway, opt => opt.MapFrom(m => m.GameTeams.Where(y => y.HomeTeam == true).Single().OpponentTeam.TeamNameShort))
              .ForMember(vm => vm.GoalsAgainstAway, opt => opt.MapFrom(m => m.GameOutcomes.Where(x => x.HomeTeam == false).Single().GoalsAgainst))
              .ForMember(vm => vm.GoalsForAway, opt => opt.MapFrom(m => m.GameOutcomes.Where(x => x.HomeTeam == false).Single().GoalsFor))
              .ForMember(vm => vm.OutcomeAway, opt => opt.MapFrom(m => m.GameOutcomes.Where(x => x.HomeTeam == false).Single().Outcome))
              .ForMember(vm => vm.OverridenAway, opt => opt.MapFrom(m => m.GameOutcomes.Where(x => x.HomeTeam == false).Single().Overriden))
              .ForMember(vm => vm.PenaltyMinutesAway, opt => opt.MapFrom(m => m.GameOutcomes.Where(x => x.HomeTeam == false).Single().PenaltyMinutes))
              .ForMember(vm => vm.SubsAway, opt => opt.MapFrom(m => m.GameOutcomes.Where(x => x.HomeTeam == false).SingleOrDefault().Subs))
              .ForMember(vm => vm.Period1ScoreAway, opt => opt.MapFrom(m => m.GameScores.Where(x => x.Period == 1 && x.TeamId == (m.GameOutcomes.Where(y => y.HomeTeam == false).Single().TeamId)).Single().Score))
              .ForMember(vm => vm.Period2ScoreAway, opt => opt.MapFrom(m => m.GameScores.Where(x => x.Period == 2 && x.TeamId == (m.GameOutcomes.Where(y => y.HomeTeam == false).Single().TeamId)).Single().Score))
              .ForMember(vm => vm.Period3ScoreAway, opt => opt.MapFrom(m => m.GameScores.Where(x => x.Period == 3 && x.TeamId == (m.GameOutcomes.Where(y => y.HomeTeam == false).Single().TeamId)).Single().Score))
              .ForMember(vm => vm.Period4ScoreAway, opt => opt.MapFrom(m => m.GameScores.Where(x => x.Period == 4 && x.TeamId == (m.GameOutcomes.Where(y => y.HomeTeam == false).SingleOrDefault().TeamId)).SingleOrDefault().Score))

              // TODO, more research...Team isn't getting populated, but opponentteam is
              .ForMember(vm => vm.TeamIdHome, opt => opt.MapFrom(m => m.GameTeams.Where(y => y.HomeTeam == false).Single().OpponentTeam.TeamId))
              .ForMember(vm => vm.TeamCodeHome, opt => opt.MapFrom(m => m.GameTeams.Where(y => y.HomeTeam == false).Single().OpponentTeam.TeamCode))
              .ForMember(vm => vm.TeamNameLongHome, opt => opt.MapFrom(m => m.GameTeams.Where(y => y.HomeTeam == false).Single().OpponentTeam.TeamNameLong))
              .ForMember(vm => vm.TeamNameShortHome, opt => opt.MapFrom(m => m.GameTeams.Where(y => y.HomeTeam == false).Single().OpponentTeam.TeamNameShort))
              .ForMember(vm => vm.GoalsAgainstHome, opt => opt.MapFrom(m => m.GameOutcomes.Where(x => x.HomeTeam == true).Single().GoalsAgainst))
              .ForMember(vm => vm.GoalsForHome, opt => opt.MapFrom(m => m.GameOutcomes.Where(x => x.HomeTeam == true).Single().GoalsFor))
              .ForMember(vm => vm.OutcomeHome, opt => opt.MapFrom(m => m.GameOutcomes.Where(x => x.HomeTeam == true).Single().Outcome))
              .ForMember(vm => vm.OverridenHome, opt => opt.MapFrom(m => m.GameOutcomes.Where(x => x.HomeTeam == true).Single().Overriden))
              .ForMember(vm => vm.PenaltyMinutesHome, opt => opt.MapFrom(m => m.GameOutcomes.Where(x => x.HomeTeam == true).Single().PenaltyMinutes))
              .ForMember(vm => vm.SubsHome, opt => opt.MapFrom(m => m.GameOutcomes.Where(x => x.HomeTeam == true).SingleOrDefault().Subs))
              .ForMember(vm => vm.Period1ScoreHome, opt => opt.MapFrom(m => m.GameScores.Where(x => x.Period == 1 && x.TeamId == (m.GameOutcomes.Where(y => y.HomeTeam == true).Single().TeamId)).Single().Score))
              .ForMember(vm => vm.Period2ScoreHome, opt => opt.MapFrom(m => m.GameScores.Where(x => x.Period == 2 && x.TeamId == (m.GameOutcomes.Where(y => y.HomeTeam == true).Single().TeamId)).Single().Score))
              .ForMember(vm => vm.Period3ScoreHome, opt => opt.MapFrom(m => m.GameScores.Where(x => x.Period == 3 && x.TeamId == (m.GameOutcomes.Where(y => y.HomeTeam == true).Single().TeamId)).Single().Score))
              .ForMember(vm => vm.Period4ScoreHome, opt => opt.MapFrom(m => m.GameScores.Where(x => x.Period == 4 && x.TeamId == (m.GameOutcomes.Where(y => y.HomeTeam == true).SingleOrDefault().TeamId)).SingleOrDefault().Score))
              .ReverseMap();

        config.CreateMap<GameRoster, GameRosterViewModel>()
              .ForMember(vm => vm.TeamCode, opt => opt.MapFrom(m => m.Team.TeamCode))
              .ForMember(vm => vm.TeamNameLong, opt => opt.MapFrom(m => m.Team.TeamNameLong))
              .ForMember(vm => vm.TeamNameShort, opt => opt.MapFrom(m => m.Team.TeamNameShort))
              .ForMember(vm => vm.SeasonName, opt => opt.MapFrom(m => m.Season.SeasonName))
              .ForMember(vm => vm.PlayerFirstName, opt => opt.MapFrom(m => m.Player.FirstName))
              .ForMember(vm => vm.PlayerLastName, opt => opt.MapFrom(m => m.Player.LastName))
              .ForMember(vm => vm.PlayerSuffix, opt => opt.MapFrom(m => m.Player.Suffix))
              .ForMember(vm => vm.SubbingForPlayerFirstName, opt => opt.MapFrom(m => m.SubbingForPlayer.FirstName))
              .ForMember(vm => vm.SubbingForPlayerLastName, opt => opt.MapFrom(m => m.SubbingForPlayer.LastName))
              .ForMember(vm => vm.SubbingForPlayerSuffix, opt => opt.MapFrom(m => m.SubbingForPlayer.Suffix))
              .ForMember(vm => vm.GameDateTime, opt => opt.MapFrom(m => m.Game.GameDateTime))
              .ForMember(vm => vm.GameYYYYMMDD, opt => opt.MapFrom(m => m.Game.GameYYYYMMDD))
              .ReverseMap();

        config.CreateMap<GameTeam, GameTeamViewModel>()
              .ForMember(vm => vm.TeamCode, opt => opt.MapFrom(m => m.Team.TeamCode))
              .ForMember(vm => vm.TeamNameLong, opt => opt.MapFrom(m => m.Team.TeamNameLong))
              .ForMember(vm => vm.TeamNameShort, opt => opt.MapFrom(m => m.Team.TeamNameShort))
              .ForMember(vm => vm.OpponentTeamCode, opt => opt.MapFrom(m => m.OpponentTeam.TeamCode))
              .ForMember(vm => vm.OpponentTeamNameLong, opt => opt.MapFrom(m => m.OpponentTeam.TeamNameLong))
              .ForMember(vm => vm.OpponentTeamNameShort, opt => opt.MapFrom(m => m.OpponentTeam.TeamNameShort))
              .ForMember(vm => vm.SeasonName, opt => opt.MapFrom(m => m.Season.SeasonName))
              .ForMember(vm => vm.GameDateTime, opt => opt.MapFrom(m => m.Game.GameDateTime))
              .ForMember(vm => vm.GameYYYYMMDD, opt => opt.MapFrom(m => m.Game.GameYYYYMMDD))
              .ReverseMap();

        config.CreateMap<GameTeam, GameCompositeViewModel>()
              .ForMember(vm => vm.GameDateTime, opt => opt.MapFrom(m => m.Game.GameDateTime))
              .ForMember(vm => vm.GameYYYYMMDD, opt => opt.MapFrom(m => m.Game.GameYYYYMMDD))
              .ForMember(vm => vm.Location, opt => opt.MapFrom(m => m.Game.Location))
              .ForMember(vm => vm.Playoffs, opt => opt.MapFrom(m => m.Game.Playoffs))
              .ForMember(vm => vm.SeasonName, opt => opt.MapFrom(m => m.Season.SeasonName))

              .ForMember(vm => vm.TeamIdAway, opt => opt.MapFrom(m => m.HomeTeam ? m.OpponentTeam.TeamId : m.Team.TeamId))
              .ForMember(vm => vm.TeamCodeAway, opt => opt.MapFrom(m => m.HomeTeam ? m.OpponentTeam.TeamCode : m.Team.TeamCode))
              .ForMember(vm => vm.TeamNameLongAway, opt => opt.MapFrom(m => m.HomeTeam ? m.OpponentTeam.TeamNameLong : m.Team.TeamNameLong))
              .ForMember(vm => vm.TeamNameShortAway, opt => opt.MapFrom(m => m.HomeTeam ? m.OpponentTeam.TeamNameShort : m.Team.TeamNameShort))
              .ForMember(vm => vm.GoalsAgainstAway, opt => opt.MapFrom(m => m.Game.GameOutcomes.Where(x => x.HomeTeam == false).SingleOrDefault().GoalsAgainst))
              .ForMember(vm => vm.GoalsForAway, opt => opt.MapFrom(m => m.Game.GameOutcomes.Where(x => x.HomeTeam == false).SingleOrDefault().GoalsFor))
              .ForMember(vm => vm.OutcomeAway, opt => opt.MapFrom(m => m.Game.GameOutcomes.Where(x => x.HomeTeam == false).SingleOrDefault().Outcome))
              .ForMember(vm => vm.OverridenAway, opt => opt.MapFrom(m => m.Game.GameOutcomes.Where(x => x.HomeTeam == false).SingleOrDefault().Overriden))
              .ForMember(vm => vm.PenaltyMinutesAway, opt => opt.MapFrom(m => m.Game.GameOutcomes.Where(x => x.HomeTeam == false).SingleOrDefault().PenaltyMinutes))
              .ForMember(vm => vm.SubsAway, opt => opt.MapFrom(m => m.Game.GameOutcomes.Where(x => x.HomeTeam == false).SingleOrDefault().Subs))
              .ForMember(vm => vm.Period1ScoreAway, opt => opt.MapFrom(m => m.Game.GameScores.Where(x => x.Period == 1 && x.TeamId == (m.Game.GameOutcomes.Where(y => y.HomeTeam == false).Single().TeamId)).SingleOrDefault().Score))
              .ForMember(vm => vm.Period2ScoreAway, opt => opt.MapFrom(m => m.Game.GameScores.Where(x => x.Period == 2 && x.TeamId == (m.Game.GameOutcomes.Where(y => y.HomeTeam == false).Single().TeamId)).SingleOrDefault().Score))
              .ForMember(vm => vm.Period3ScoreAway, opt => opt.MapFrom(m => m.Game.GameScores.Where(x => x.Period == 3 && x.TeamId == (m.Game.GameOutcomes.Where(y => y.HomeTeam == false).Single().TeamId)).SingleOrDefault().Score))
              .ForMember(vm => vm.Period4ScoreAway, opt => opt.MapFrom(m => m.Game.GameScores.Where(x => x.Period == 4 && x.TeamId == (m.Game.GameOutcomes.Where(y => y.HomeTeam == false).SingleOrDefault().TeamId)).SingleOrDefault().Score))

              .ForMember(vm => vm.TeamIdHome, opt => opt.MapFrom(m => m.HomeTeam ? m.Team.TeamId : m.OpponentTeam.TeamId))
              .ForMember(vm => vm.TeamCodeHome, opt => opt.MapFrom(m => m.HomeTeam ? m.Team.TeamCode : m.OpponentTeam.TeamCode))
              .ForMember(vm => vm.TeamNameLongHome, opt => opt.MapFrom(m => m.HomeTeam ? m.Team.TeamNameLong : m.OpponentTeam.TeamNameLong))
              .ForMember(vm => vm.TeamNameShortHome, opt => opt.MapFrom(m => m.HomeTeam ? m.Team.TeamNameShort : m.OpponentTeam.TeamNameShort))
              .ForMember(vm => vm.GoalsAgainstHome, opt => opt.MapFrom(m => m.Game.GameOutcomes.Where(x => x.HomeTeam == true).SingleOrDefault().GoalsAgainst))
              .ForMember(vm => vm.GoalsForHome, opt => opt.MapFrom(m => m.Game.GameOutcomes.Where(x => x.HomeTeam == true).SingleOrDefault().GoalsFor))
              .ForMember(vm => vm.OutcomeHome, opt => opt.MapFrom(m => m.Game.GameOutcomes.Where(x => x.HomeTeam == true).SingleOrDefault().Outcome))
              .ForMember(vm => vm.OverridenHome, opt => opt.MapFrom(m => m.Game.GameOutcomes.Where(x => x.HomeTeam == true).SingleOrDefault().Overriden))
              .ForMember(vm => vm.PenaltyMinutesHome, opt => opt.MapFrom(m => m.Game.GameOutcomes.Where(x => x.HomeTeam == true).SingleOrDefault().PenaltyMinutes))
              .ForMember(vm => vm.SubsHome, opt => opt.MapFrom(m => m.Game.GameOutcomes.Where(x => x.HomeTeam == true).SingleOrDefault().Subs))
              .ForMember(vm => vm.Period1ScoreHome, opt => opt.MapFrom(m => m.Game.GameScores.Where(x => x.Period == 1 && x.TeamId == (m.Game.GameOutcomes.Where(y => y.HomeTeam == true).Single().TeamId)).SingleOrDefault().Score))
              .ForMember(vm => vm.Period2ScoreHome, opt => opt.MapFrom(m => m.Game.GameScores.Where(x => x.Period == 2 && x.TeamId == (m.Game.GameOutcomes.Where(y => y.HomeTeam == true).Single().TeamId)).SingleOrDefault().Score))
              .ForMember(vm => vm.Period3ScoreHome, opt => opt.MapFrom(m => m.Game.GameScores.Where(x => x.Period == 3 && x.TeamId == (m.Game.GameOutcomes.Where(y => y.HomeTeam == true).Single().TeamId)).SingleOrDefault().Score))
              .ForMember(vm => vm.Period4ScoreHome, opt => opt.MapFrom(m => m.Game.GameScores.Where(x => x.Period == 4 && x.TeamId == (m.Game.GameOutcomes.Where(y => y.HomeTeam == true).SingleOrDefault().TeamId)).SingleOrDefault().Score))
              .ReverseMap();

        config.CreateMap<GoalieStatCareer, GoalieStatCareerViewModel>()
              .ForMember(vm => vm.PlayerFirstName, opt => opt.MapFrom(m => m.Player.FirstName))
              .ForMember(vm => vm.PlayerLastName, opt => opt.MapFrom(m => m.Player.LastName))
              .ForMember(vm => vm.PlayerSuffix, opt => opt.MapFrom(m => m.Player.Suffix))
              .ReverseMap();

        config.CreateMap<GoalieStatGame, GoalieStatGameViewModel>()
              .ForMember(vm => vm.PlayerFirstName, opt => opt.MapFrom(m => m.Player.FirstName))
              .ForMember(vm => vm.PlayerLastName, opt => opt.MapFrom(m => m.Player.LastName))
              .ForMember(vm => vm.PlayerSuffix, opt => opt.MapFrom(m => m.Player.Suffix))
              .ForMember(vm => vm.TeamCode, opt => opt.MapFrom(m => m.Team.TeamCode))
              .ForMember(vm => vm.TeamNameLong, opt => opt.MapFrom(m => m.Team.TeamNameLong))
              .ForMember(vm => vm.TeamNameShort, opt => opt.MapFrom(m => m.Team.TeamNameShort))
              .ForMember(vm => vm.GameDateTime, opt => opt.MapFrom(m => m.Game.GameDateTime))
              .ReverseMap();

        config.CreateMap<GoalieStatSeason, GoalieStatSeasonViewModel>()
              .ForMember(vm => vm.PlayerFirstName, opt => opt.MapFrom(m => m.Player.FirstName))
              .ForMember(vm => vm.PlayerLastName, opt => opt.MapFrom(m => m.Player.LastName))
              .ForMember(vm => vm.PlayerSuffix, opt => opt.MapFrom(m => m.Player.Suffix))
              .ForMember(vm => vm.SeasonName, opt => opt.MapFrom(m => m.Season.SeasonName))
              .ReverseMap();

        config.CreateMap<GoalieStatSeasonNoPlayoffs, GoalieStatSeasonNoPlayoffsViewModel>()
              .ForMember(vm => vm.PlayerFirstName, opt => opt.MapFrom(m => m.Player.FirstName))
              .ForMember(vm => vm.PlayerLastName, opt => opt.MapFrom(m => m.Player.LastName))
              .ForMember(vm => vm.PlayerSuffix, opt => opt.MapFrom(m => m.Player.Suffix))
              .ForMember(vm => vm.SeasonName, opt => opt.MapFrom(m => m.Season.SeasonName))
              .ReverseMap();

        config.CreateMap<GoalieStatTeam, GoalieStatTeamViewModel>()
              .ForMember(vm => vm.PlayerFirstName, opt => opt.MapFrom(m => m.Player.FirstName))
              .ForMember(vm => vm.PlayerLastName, opt => opt.MapFrom(m => m.Player.LastName))
              .ForMember(vm => vm.PlayerSuffix, opt => opt.MapFrom(m => m.Player.Suffix))
              .ForMember(vm => vm.TeamCode, opt => opt.MapFrom(m => m.Team.TeamCode))
              .ForMember(vm => vm.TeamNameLong, opt => opt.MapFrom(m => m.Team.TeamNameLong))
              .ForMember(vm => vm.TeamNameShort, opt => opt.MapFrom(m => m.Team.TeamNameShort))
              .ReverseMap();

        config.CreateMap<LineStatGame, LineStatGameViewModel>()
              .ForMember(vm => vm.TeamCode, opt => opt.MapFrom(m => m.Team.TeamCode))
              .ForMember(vm => vm.TeamNameLong, opt => opt.MapFrom(m => m.Team.TeamNameLong))
              .ForMember(vm => vm.TeamNameShort, opt => opt.MapFrom(m => m.Team.TeamNameShort))
              .ForMember(vm => vm.TeamCodeOpponent, opt => opt.MapFrom(m => m.OpponentTeam.TeamCode))
              .ForMember(vm => vm.TeamNameLongOpponent, opt => opt.MapFrom(m => m.OpponentTeam.TeamNameLong))
              .ForMember(vm => vm.TeamNameShortOpponent, opt => opt.MapFrom(m => m.OpponentTeam.TeamNameShort))
              .ForMember(vm => vm.GameDateTime, opt => opt.MapFrom(m => m.Game.GameDateTime))
              .ReverseMap();

        config.CreateMap<LineStatSeason, LineStatSeasonViewModel>()
              .ForMember(vm => vm.TeamCode, opt => opt.MapFrom(m => m.Team.TeamCode))
              .ForMember(vm => vm.TeamNameLong, opt => opt.MapFrom(m => m.Team.TeamNameLong))
              .ForMember(vm => vm.TeamNameShort, opt => opt.MapFrom(m => m.Team.TeamNameShort))
              .ForMember(vm => vm.SeasonName, opt => opt.MapFrom(m => m.Season.SeasonName))
              .ReverseMap();

        config.CreateMap<LineStatTeam, LineStatTeamViewModel>()
              .ForMember(vm => vm.TeamCode, opt => opt.MapFrom(m => m.Team.TeamCode))
              .ForMember(vm => vm.TeamNameLong, opt => opt.MapFrom(m => m.Team.TeamNameLong))
              .ForMember(vm => vm.TeamNameShort, opt => opt.MapFrom(m => m.Team.TeamNameShort))
              .ForMember(vm => vm.TeamCodeOpponent, opt => opt.MapFrom(m => m.OpponentTeam.TeamCode))
              .ForMember(vm => vm.TeamNameLongOpponent, opt => opt.MapFrom(m => m.OpponentTeam.TeamNameLong))
              .ForMember(vm => vm.TeamNameShortOpponent, opt => opt.MapFrom(m => m.OpponentTeam.TeamNameShort))
              .ReverseMap();

        config.CreateMap<Player, PlayerViewModel>()
              .ReverseMap();

        config.CreateMap<PlayerStatCareer, PlayerStatCareerViewModel>()
              .ForMember(vm => vm.PlayerFirstName, opt => opt.MapFrom(m => m.Player.FirstName))
              .ForMember(vm => vm.PlayerLastName, opt => opt.MapFrom(m => m.Player.LastName))
              .ForMember(vm => vm.PlayerSuffix, opt => opt.MapFrom(m => m.Player.Suffix))
              .ReverseMap();

        config.CreateMap<PlayerStatGame, PlayerStatGameViewModel>()
              .ForMember(vm => vm.PlayerFirstName, opt => opt.MapFrom(m => m.Player.FirstName))
              .ForMember(vm => vm.PlayerLastName, opt => opt.MapFrom(m => m.Player.LastName))
              .ForMember(vm => vm.PlayerSuffix, opt => opt.MapFrom(m => m.Player.Suffix))
              .ForMember(vm => vm.TeamCode, opt => opt.MapFrom(m => m.Team.TeamCode))
              .ForMember(vm => vm.TeamNameLong, opt => opt.MapFrom(m => m.Team.TeamNameLong))
              .ForMember(vm => vm.TeamNameShort, opt => opt.MapFrom(m => m.Team.TeamNameShort))
              .ForMember(vm => vm.GameDateTime, opt => opt.MapFrom(m => m.Game.GameDateTime))

              // TODO, add gameteam to playerstatgame so can get opponent team easily
              //.ForMember(vm => vm.TeamCodeOpponent, opt => opt.MapFrom(m => m.Game.GameTeams.Where(x=>x.GameId == m.GameId && x.TeamId == m.TeamId).Single().OpponentTeam.TeamCode)
              //.ForMember(vm => vm.TeamNameLongOpponent, opt => opt.MapFrom(m => m.Team.TeamNameLong))
              //.ForMember(vm => vm.TeamNameShortOpponent, opt => opt.MapFrom(m => m.Team.TeamNameShort))

              .ReverseMap();

        config.CreateMap<PlayerStatSeason, PlayerStatSeasonViewModel>()
              .ForMember(vm => vm.PlayerFirstName, opt => opt.MapFrom(m => m.Player.FirstName))
              .ForMember(vm => vm.PlayerLastName, opt => opt.MapFrom(m => m.Player.LastName))
              .ForMember(vm => vm.PlayerSuffix, opt => opt.MapFrom(m => m.Player.Suffix))
              .ForMember(vm => vm.SeasonName, opt => opt.MapFrom(m => m.Season.SeasonName))
              .ReverseMap();

        config.CreateMap<PlayerStatSeasonNoPlayoffs, PlayerStatSeasonNoPlayoffsViewModel>()
              .ForMember(vm => vm.PlayerFirstName, opt => opt.MapFrom(m => m.Player.FirstName))
              .ForMember(vm => vm.PlayerLastName, opt => opt.MapFrom(m => m.Player.LastName))
              .ForMember(vm => vm.PlayerSuffix, opt => opt.MapFrom(m => m.Player.Suffix))
              .ForMember(vm => vm.SeasonName, opt => opt.MapFrom(m => m.Season.SeasonName))
              .ReverseMap();

        config.CreateMap<PlayerStatTeam, PlayerStatTeamViewModel>()
              .ForMember(vm => vm.PlayerFirstName, opt => opt.MapFrom(m => m.Player.FirstName))
              .ForMember(vm => vm.PlayerLastName, opt => opt.MapFrom(m => m.Player.LastName))
              .ForMember(vm => vm.PlayerSuffix, opt => opt.MapFrom(m => m.Player.Suffix))
              .ForMember(vm => vm.TeamCode, opt => opt.MapFrom(m => m.Team.TeamCode))
              .ForMember(vm => vm.TeamNameLong, opt => opt.MapFrom(m => m.Team.TeamNameLong))
              .ForMember(vm => vm.TeamNameShort, opt => opt.MapFrom(m => m.Team.TeamNameShort))
              .ReverseMap();

        config.CreateMap<ScoreSheetEntryGoal, ScoreSheetEntryGoalViewModel>()
              .ReverseMap();

        config.CreateMap<ScoreSheetEntryPenalty, ScoreSheetEntryPenaltyViewModel>()
              .ReverseMap();

        config.CreateMap<ScoreSheetEntrySub, ScoreSheetEntrySubViewModel>()
              .ReverseMap();

        config.CreateMap<ScoreSheetEntryProcessedGoal, ScoreSheetEntryProcessedGoalViewModel>()
              .ForMember(vm => vm.TeamCode, opt => opt.MapFrom(m => m.Team.TeamCode))
              .ForMember(vm => vm.TeamNameLong, opt => opt.MapFrom(m => m.Team.TeamNameLong))
              .ForMember(vm => vm.TeamNameShort, opt => opt.MapFrom(m => m.Team.TeamNameShort))
              .ForMember(vm => vm.GoalPlayerFirstName, opt => opt.MapFrom(m => m.GoalPlayer.FirstName))
              .ForMember(vm => vm.GoalPlayerLastName, opt => opt.MapFrom(m => m.GoalPlayer.LastName))
              .ForMember(vm => vm.GoalPlayerSuffix, opt => opt.MapFrom(m => m.GoalPlayer.Suffix))
              .ForMember(vm => vm.Assist1PlayerFirstName, opt => opt.MapFrom(m => m.Assist1Player.FirstName))
              .ForMember(vm => vm.Assist1PlayerLastName, opt => opt.MapFrom(m => m.Assist1Player.LastName))
              .ForMember(vm => vm.Assist1PlayerSuffix, opt => opt.MapFrom(m => m.Assist1Player.Suffix))
              .ForMember(vm => vm.Assist2PlayerFirstName, opt => opt.MapFrom(m => m.Assist2Player.FirstName))
              .ForMember(vm => vm.Assist2PlayerLastName, opt => opt.MapFrom(m => m.Assist2Player.LastName))
              .ForMember(vm => vm.Assist2PlayerSuffix, opt => opt.MapFrom(m => m.Assist2Player.Suffix))
              .ForMember(vm => vm.Assist3PlayerFirstName, opt => opt.MapFrom(m => m.Assist3Player.FirstName))
              .ForMember(vm => vm.Assist3PlayerLastName, opt => opt.MapFrom(m => m.Assist3Player.LastName))
              .ForMember(vm => vm.Assist3PlayerSuffix, opt => opt.MapFrom(m => m.Assist3Player.Suffix))
              .ReverseMap();

        config.CreateMap<ScoreSheetEntryProcessedPenalty, ScoreSheetEntryProcessedPenaltyViewModel>()
              .ForMember(vm => vm.TeamCode, opt => opt.MapFrom(m => m.Team.TeamCode))
              .ForMember(vm => vm.TeamNameLong, opt => opt.MapFrom(m => m.Team.TeamNameLong))
              .ForMember(vm => vm.TeamNameShort, opt => opt.MapFrom(m => m.Team.TeamNameShort))
              .ForMember(vm => vm.PlayerFirstName, opt => opt.MapFrom(m => m.Player.FirstName))
              .ForMember(vm => vm.PlayerLastName, opt => opt.MapFrom(m => m.Player.LastName))
              .ForMember(vm => vm.PlayerSuffix, opt => opt.MapFrom(m => m.Player.Suffix))
              .ForMember(vm => vm.PenaltyCode, opt => opt.MapFrom(m => m.Penalty.PenaltyCode))
              .ForMember(vm => vm.PenaltyName, opt => opt.MapFrom(m => m.Penalty.PenaltyName))
              .ReverseMap();

        config.CreateMap<ScoreSheetEntryProcessedSub, ScoreSheetEntryProcessedSubViewModel>()
              .ForMember(vm => vm.TeamCode, opt => opt.MapFrom(m => m.Team.TeamCode))
              .ForMember(vm => vm.TeamNameLong, opt => opt.MapFrom(m => m.Team.TeamNameLong))
              .ForMember(vm => vm.TeamNameShort, opt => opt.MapFrom(m => m.Team.TeamNameShort))
              .ForMember(vm => vm.SubPlayerFirstName, opt => opt.MapFrom(m => m.SubPlayer.FirstName))
              .ForMember(vm => vm.SubPlayerLastName, opt => opt.MapFrom(m => m.SubPlayer.LastName))
              .ForMember(vm => vm.SubPlayerSuffix, opt => opt.MapFrom(m => m.SubPlayer.Suffix))
              .ForMember(vm => vm.SubbingForPlayerFirstName, opt => opt.MapFrom(m => m.SubbingForPlayer.FirstName))
              .ForMember(vm => vm.SubbingForPlayerLastName, opt => opt.MapFrom(m => m.SubbingForPlayer.LastName))
              .ForMember(vm => vm.SubbingForPlayerSuffix, opt => opt.MapFrom(m => m.SubbingForPlayer.Suffix))
              .ReverseMap();

        config.CreateMap<Season, SeasonViewModel>()
              .ReverseMap();

        config.CreateMap<TeamRoster, TeamRosterViewModel>()
              .ForMember(vm => vm.TeamCode, opt => opt.MapFrom(m => m.Team.TeamCode))
              .ForMember(vm => vm.TeamNameLong, opt => opt.MapFrom(m => m.Team.TeamNameLong))
              .ForMember(vm => vm.TeamNameShort, opt => opt.MapFrom(m => m.Team.TeamNameShort))
              .ForMember(vm => vm.SeasonName, opt => opt.MapFrom(m => m.Season.SeasonName))
              .ForMember(vm => vm.PlayerFirstName, opt => opt.MapFrom(m => m.Player.FirstName))
              .ForMember(vm => vm.PlayerLastName, opt => opt.MapFrom(m => m.Player.LastName))
              .ForMember(vm => vm.PlayerSuffix, opt => opt.MapFrom(m => m.Player.Suffix))
              .ReverseMap();

        config.CreateMap<TeamStanding, TeamStandingViewModel>()
              .ForMember(vm => vm.DivisionLongName, opt => opt.MapFrom(m => m.Division.DivisionLongName))
              .ForMember(vm => vm.DivisionShortName, opt => opt.MapFrom(m => m.Division.DivisionShortName))
              .ForMember(vm => vm.TeamCode, opt => opt.MapFrom(m => m.Team.TeamCode))
              .ForMember(vm => vm.TeamNameLong, opt => opt.MapFrom(m => m.Team.TeamNameLong))
              .ForMember(vm => vm.TeamNameShort, opt => opt.MapFrom(m => m.Team.TeamNameShort))
              .ForMember(vm => vm.SeasonName, opt => opt.MapFrom(m => m.Season.SeasonName))
              .ReverseMap();

        config.CreateMap<Team, TeamViewModel>()
              .ForMember(vm => vm.DivisionLongName, opt => opt.MapFrom(m => m.Division.DivisionLongName))
              .ForMember(vm => vm.DivisionShortName, opt => opt.MapFrom(m => m.Division.DivisionShortName))
              .ForMember(vm => vm.SeasonName, opt => opt.MapFrom(m => m.Season.SeasonName))
              .ReverseMap();

      });

      app.UseMvc(routes =>
      {
        routes.MapRoute(
            name: "schedule",
            template: "Schedule/Index",
            defaults: new { controller = "Schedule", action = "Index" }
        );

        routes.MapRoute(
            name: "scheduleTeamFeed",
            template: "Schedule/TeamFeed/Seasons/{seasonId}/Teams/{teamId}/{desc}",
            defaults: new { controller = "Schedule", action = "TeamFeed" }
        );

        routes.MapRoute(
                  name: "default",
                  template: "{controller=Ng}/{action=Index}/{id?}");
      });
    }
  }
}
