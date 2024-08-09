using Microsoft.EntityFrameworkCore;

namespace eshop_angular_18.Server.Models
{
  public class EshopContext : DbContext
  {
    public EshopContext(DbContextOptions<EshopContext> options)
        : base(options)
    {
    }

    public DbSet<Item> Items { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Address> Addresses { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      modelBuilder.Entity<Item>().Property(p =>
          p.Price).HasColumnType("decimal(18,2)");
    }
  }
}
