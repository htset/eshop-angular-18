namespace eshop_angular_18.Server.Models
{
  public class Image
  {
    public int Id { get; set; }
    public int ItemId { get; set; }
    public string? FileName { get; set; }
    public string? FileType { get; set; }
  }
}
