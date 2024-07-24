namespace eshop_angular_18.Server.Models
{
  public class ItemPayload
  {
    public List<Item> Items { get; set; }
    public int Count { get; set; }

    public ItemPayload(List<Item> Items, int Count)
    {
      this.Items = Items;
      this.Count = Count;
    }
  }

}
