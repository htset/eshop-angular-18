using eshop_angular_18.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace eshop_angular_18.Server.Controllers
{
  [Route("api/items")]
  [ApiController]
  public class ItemController : ControllerBase
  {
    private readonly EshopContext _context;

    public ItemController(EshopContext context)
    {
      _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ItemPayload>> GetItems()
    {
      int count = await _context.Items.CountAsync();
      List<Item> list = await _context.Items.ToListAsync();
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
