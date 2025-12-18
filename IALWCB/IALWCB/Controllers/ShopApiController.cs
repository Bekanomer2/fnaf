using Microsoft.AspNetCore.Mvc;
using IALWCB.Data;
using IALWCB.Models;

namespace IALWCB.Controllers
{
    [Route("api/shop")]
    [ApiController]
    public class ShopApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ShopApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromBody] Order order)
        {
            if (order == null || order.Items.Count == 0)
                return BadRequest("Invalid order.");

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Order processed successfully", orderId = order.Id });
        }
    }
}
