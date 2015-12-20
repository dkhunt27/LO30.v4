using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Hosting;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Data.Entity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using LO30.Web.Models;
using LO30.Web.Services;
using LO30.Web.Models.Context;
using Newtonsoft.Json.Serialization;
using AutoMapper;
using LO30.Web.Models.Objects;
using LO30.Web.ViewModels.Api;

namespace LO30.Web
{
  public class Startup
  {

    public IConfigurationRoot Configuration { get; set; }

    public Startup(IHostingEnvironment env)
    {
      // Set up configuration sources.
      var builder = new ConfigurationBuilder()
          .AddJsonFile("appsettings.json")
          .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true);

      if (env.IsDevelopment())
      {
        // For more details on using the user secret store see http://go.microsoft.com/fwlink/?LinkID=532709
        builder.AddUserSecrets();
      }

      builder.AddEnvironmentVariables();
      Configuration = builder.Build();
    }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
      var lo30ReportingConnString = Configuration["Data:LO30ReportingConnection:ConnectionString1"];

      // Add framework services.
      services.AddEntityFramework()
          .AddSqlServer()
          .AddDbContext<LO30DbContext>(opt => opt.UseSqlServer(lo30ReportingConnString));

      services.AddIdentity<ApplicationUser, IdentityRole>()
          .AddEntityFrameworkStores<LO30DbContext>()
          .AddDefaultTokenProviders();

      services.AddMvc()
        .AddJsonOptions(opt =>
        {
          opt.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
        });

      // Add application services.
      services.AddTransient<IEmailSender, AuthMessageSender>();
      services.AddTransient<ISmsSender, AuthMessageSender>();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
    {
      loggerFactory.AddConsole(Configuration.GetSection("Logging"));
      loggerFactory.AddDebug();

      if (env.IsDevelopment())
      {
        app.UseBrowserLink();
        app.UseDeveloperExceptionPage();
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

      app.UseIISPlatformHandler(options => options.AuthenticationDescriptions.Clear());

      app.UseStaticFiles();

      app.UseIdentity();

      Mapper.Initialize(config =>
      {
        config.CreateMap<TeamStanding, TeamStandingViewModel>()
              .ForMember(vm => vm.DivisionLongName, opt => opt.MapFrom(m => m.Division.DivisionLongName))
              .ForMember(vm => vm.DivisionShortName, opt => opt.MapFrom(m => m.Division.DivisionShortName))
              .ForMember(vm => vm.TeamCode, opt => opt.MapFrom(m => m.Team.TeamCode))
              .ForMember(vm => vm.TeamNameLong, opt => opt.MapFrom(m => m.Team.TeamNameLong))
              .ForMember(vm => vm.TeamNameShort, opt => opt.MapFrom(m => m.Team.TeamNameShort))
              .ReverseMap();
      });

      // To configure external authentication please see http://go.microsoft.com/fwlink/?LinkID=532715

      app.UseMvc(routes =>
      {
        routes.MapRoute(
                  name: "default",
                  template: "{controller=Home}/{action=Index}/{id?}");
      });
    }

    // Entry point for the application.
    public static void Main(string[] args) => WebApplication.Run<Startup>(args);
  }
}
