
using eshop_angular_18.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace eshop_angular_18.Server
{
  public class Program
  {
    public static void Main(string[] args)
    {
      var allowSpecificOrigins = "angular_eshop_AllowSpecificOrigins";

      var builder = WebApplication.CreateBuilder(args);

      // Add services to the container.

      builder.Services.AddControllers();
      // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
      builder.Services.AddEndpointsApiExplorer();
      builder.Services.AddSwaggerGen();

      var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
      builder.Services.AddDbContext<EshopContext>(x => x.UseSqlServer(connectionString));

      builder.Services.AddCors(options =>
      {
        options.AddPolicy(allowSpecificOrigins,
            builder =>
              builder.WithOrigins("http://localhost:4200", "https://localhost:4200")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
      });

      var app = builder.Build();

      app.UseDefaultFiles();
      app.UseStaticFiles();

      // Configure the HTTP request pipeline.
      if (app.Environment.IsDevelopment())
      {
        app.UseSwagger();
        app.UseSwaggerUI();
      }

      app.UseCors(allowSpecificOrigins);

      app.UseHttpsRedirection();

      app.UseAuthorization();


      app.MapControllers();

      app.MapFallbackToFile("/index.html");

      app.Run();
    }
  }
}
