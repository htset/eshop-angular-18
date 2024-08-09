using System.ComponentModel.DataAnnotations;

namespace eshop_angular_18.Server.Models
{
  public class Order
  {
    [Required]
    public int Id { get; set; }
    [Required]
    public int UserId { get; set; }
    [Required]
    public DateTime OrderDate { get; set; }
    [Required]
    public decimal TotalPrice { get; set; }
    [Required]
    public List<OrderDetail> OrderDetails { get; set; }
    [Required]
    public string? FirstName { get; set; }
    [Required]
    public string? LastName { get; set; }
    [Required]
    public string? Street { get; set; }
    [Required]
    public string? Zip { get; set; }
    [Required]
    public string? City { get; set; }
    [Required]
    public string? Country { get; set; }
  }
}
