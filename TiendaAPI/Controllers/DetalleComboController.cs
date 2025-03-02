using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TiendaAPI.Data;
using TiendaAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace TiendaAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DetalleComboController : ControllerBase
    {
        private readonly TiendaDbContext _context;

        public DetalleComboController(TiendaDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DetalleCombo>>> GetDetalleCombos()
        {
            return await _context.DetalleCombo
                .Include(dc => dc.Combo)
                .Include(dc => dc.Producto)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DetalleCombo>> GetDetalleCombo(int id)
        {
            var detalleCombo = await _context.DetalleCombo
                .Include(dc => dc.Combo)
                .Include(dc => dc.Producto)
                .FirstOrDefaultAsync(dc => dc.idDetalleCombo == id);

            if (detalleCombo == null)
            {
                return NotFound($"DetalleCombo con ID {id} no encontrado.");
            }

            return Ok(detalleCombo);
        }

        [HttpPost]
        public async Task<ActionResult<DetalleCombo>> PostDetalleCombo(DetalleCombo detalleCombo)
        {
            _context.DetalleCombo.Add(detalleCombo);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDetalleCombo), new { id = detalleCombo.idDetalleCombo }, detalleCombo);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDetalleCombo(int id)
        {
            var detalleCombo = await _context.DetalleCombo.FindAsync(id);
            if (detalleCombo == null)
            {
                return NotFound();
            }

            _context.DetalleCombo.Remove(detalleCombo);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
