namespace eshop_angular_18.Server.Controllers
{
  public class QueryStringParameters
  {
    const int maxPageSize = 50;
    public int PageNumber { get; set; } = 1;
    private int _pageSize = 10;
    public int PageSize
    {
      get { return _pageSize; }
      set { _pageSize = (value > maxPageSize) ? maxPageSize : value; }
    }
    public string? Name { get; set; } = string.Empty;
    public string? Category { get; set; } = string.Empty;
  }

}
