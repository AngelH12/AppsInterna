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
    public class CombosController : ControllerBase
    {
        private readonly TiendaDbContext _context;

        public CombosController(TiendaDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Combo>>> GetCombos()
        {
            try
            {
                var combos = await _context.Combos.ToListAsync();
                return Ok(combos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Combo>> GetCombo(int id)
        {
            try
            {
                var combo = await _context.Combos.FindAsync(id);
                if (combo == null)
                {
                    return NotFound($"Combo con ID {id} no encontrado.");
                }

                return Ok(combo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Combo>> PostCombo(Combo combo)
        {
            try
            {
                if (combo == null)
                {
                    return BadRequest("El combo no puede ser nulo.");
                }

                _context.Combos.Add(combo);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetCombo), new { id = combo.idCombo }, combo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCombo(int id, Combo combo)
        {
            if (id != combo.idCombo)
            {
                return BadRequest("El ID del combo no coincide.");
            }

            try
            {
                _context.Entry(combo).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ComboExists(id))
                {
                    return NotFound($"Combo con ID {id} no encontrado.");
                }
                else
                {
                    throw;
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCombo(int id)
        {
            try
            {
                var combo = await _context.Combos.FindAsync(id);
                if (combo == null)
                {
                    return NotFound($"Combo con ID {id} no encontrado.");
                }

                _context.Combos.Remove(combo);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        private bool ComboExists(int id)
        {
            return _context.Combos.Any(e => e.idCombo == id);
        }
    }
}
