
using eshop_angular_18.Server.Helpers;
using eshop_angular_18.Server.Models;
using eshop_angular_18.Server.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.OData;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OData.Edm;
using Microsoft.OData.ModelBuilder;
using Serilog;
using System.Text;

namespace eshop_angular_18.Server
{
  public class Program
  {
    static IEdmModel GetEdmModel()
    {
      var obuilder = new ODataConventionModelBuilder();
      obuilder.EntitySet<Order>("Orders");
      obuilder.EnableLowerCamelCase();
      return obuilder.GetEdmModel();
    }

    public static void Main(string[] args)
    {
      var allowSpecificOrigins = "angular_eshop_AllowSpecificOrigins";
      var builder = WebApplication.CreateBuilder(args);

      var Configuration = builder.Configuration
        .SetBasePath(Directory.GetCurrentDirectory())
        .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
        .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"}.json", optional: true)
        .Build();

      Log.Logger = new LoggerConfiguration()
           .ReadFrom.Configuration(Configuration)
           .CreateLogger();

      builder.Host.UseSerilog();

      builder.Services.AddScoped<IUserService, UserService>();

      // Add services to the container.

      builder.Services.AddControllers();
      // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
      builder.Services.AddEndpointsApiExplorer();
      builder.Services.AddSwaggerGen();

      builder.Services.AddControllers()
        .AddOData(options => options
            .AddRouteComponents("odata", GetEdmModel())
            .Select()
            .Filter()
            .OrderBy()
            .SetMaxTop(50)
            .Count());

      var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
      builder.Services.AddDbContext<EshopContext>(x => x.UseSqlServer(connectionString));

      builder.Services.AddHttpContextAccessor();

      builder.Services.AddCors(options =>
      {
        options.AddPolicy(allowSpecificOrigins,
            builder =>
              builder.WithOrigins("http://localhost:4200", "https://localhost:4200")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
      });

      var appSettingsSection = builder.Configuration.GetSection("AppSettings");
      builder.Services.Configure<AppSettings>(appSettingsSection);

      var appSettings = appSettingsSection.Get<AppSettings>();
      var key = Encoding.ASCII.GetBytes(appSettings!.Secret);

      builder.Services.AddAuthentication(x =>
      {
        x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
      })
      .AddJwtBearer(x =>
      {
        x.RequireHttpsMetadata = false;
        x.SaveToken = true;
        x.TokenValidationParameters = new TokenValidationParameters
        {
          ValidateIssuerSigningKey = true,
          IssuerSigningKey = new SymmetricSecurityKey(key),
          ValidateIssuer = false,
          ValidateAudience = false,
          RoleClaimType = "role",
          NameClaimType = "name"
        };
        x.MapInboundClaims = false;
      }
      );

      var app = builder.Build();

      app.UseDefaultFiles();
      app.UseStaticFiles();

      // Configure the HTTP request pipeline.
      //if (app.Environment.IsDevelopment())
      //{
      //  app.UseSwagger();
      //  app.UseSwaggerUI();
      //}

      app.UseCors(allowSpecificOrigins);

      app.UseHttpsRedirection();

      app.UseAuthentication();
      app.UseAuthorization();

      app.MapControllers();

      app.MapFallbackToFile("/index.html");

      app.Run();
    }
  }
}
