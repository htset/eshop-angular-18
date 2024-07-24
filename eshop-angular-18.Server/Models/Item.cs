namespace eshop_angular_18.Server.Models
{
  public class Item
  {
    public int Id { get; set; }
    public string? Name { get; set; }
    public decimal Price { get; set; }
    public string? Category { get; set; }
    public string? Description { get; set; }
  }
}
