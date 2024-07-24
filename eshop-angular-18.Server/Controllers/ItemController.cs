using eshop_angular_18.Server.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace eshop_angular_18.Server.Controllers
{
  [Route("api/items")]
  [EnableCors("angular_eshop_AllowSpecificOrigins")]
  [ApiController]
  public class ItemController : ControllerBase
  {
    private readonly EshopContext _context;

    public ItemController(EshopContext context)
    {
      _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ItemPayload>> GetItems(
        [FromQuery] QueryStringParameters qsParameters)
    {
      IQueryable<Item> returnItems = _context.Items.OrderBy(on => on.Id);

      if (qsParameters.Name != null
          && !qsParameters.Name.Trim().Equals(string.Empty))
        returnItems = returnItems
            .Where(item =>
                item.Name.ToLower()
                .Contains(qsParameters.Name.Trim().ToLower()));

      if (qsParameters.Category != null
          && !qsParameters.Category.Trim().Equals(string.Empty))
      {
        string[] categories = qsParameters.Category.Split('#');
        returnItems = returnItems
            .Where(item => categories.Contains(item.Category));
      }

      //get total count before paging
      int count = await returnItems.CountAsync();

      returnItems = returnItems
          .Skip((qsParameters.PageNumber - 1) * qsParameters.PageSize)
          .Take(qsParameters.PageSize);

      List<Item> list = await returnItems.ToListAsync();

      return new ItemPayload(list, count);
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<Item>> GetItem(int id)
    {
      var Item = await _context.Items.FindAsync(id);
      if (Item == null)
      {
        return NotFound();
      }
      return Item;
    }
  }
}
