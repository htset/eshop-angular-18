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
    public DbSet<Order> Orders { get; set; }
    public DbSet<Image> Images { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      modelBuilder.Entity<Item>().Property(p =>
          p.Price).HasColumnType("decimal(18,2)");
      modelBuilder.Entity<Order>().Property(p
        => p.TotalPrice).HasColumnType("decimal(18,2)");
      modelBuilder.Entity<OrderDetail>().Property(p
        => p.ItemUnitPrice).HasColumnType("decimal(18,2)");
      modelBuilder.Entity<OrderDetail>().Property(p
        => p.Quantity).HasColumnType("decimal(18,2)");
      modelBuilder.Entity<OrderDetail>().Property(p
        => p.TotalPrice).HasColumnType("decimal(18,2)");
    }
  }
}
