using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TiendaAPI.Data;
using TiendaAPI.Models;

namespace TiendaAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IngredientesController : ControllerBase
    {
        private readonly TiendaDbContext _context;

        public IngredientesController(TiendaDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ingrediente>>> GetIngredientes()
        {
            try
            {
                var ingredientes = await _context.Ingredientes.ToListAsync();
                return Ok(ingredientes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Ingrediente>> GetIngrediente(int id)
        {
            try
            {
                var ingrediente = await _context.Ingredientes.FindAsync(id);
                if (ingrediente == null)
                {
                    return NotFound($"Ingrediente con ID {id} no encontrado.");
                }

                return Ok(ingrediente);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Ingrediente>> PostIngrediente(Ingrediente ingrediente)
        {
            try
            {
                if (ingrediente == null)
                {
                    return BadRequest("El ingrediente no puede ser nulo.");
                }

                _context.Ingredientes.Add(ingrediente);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetIngrediente), new { id = ingrediente.idIngrediente }, ingrediente);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutIngrediente(int id, Ingrediente ingrediente)
        {
            if (id != ingrediente.idIngrediente)
            {
                return BadRequest("El ID del ingrediente no coincide.");
            }

            try
            {
                _context.Entry(ingrediente).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IngredienteExists(id))
                {
                    return NotFound($"Ingrediente con ID {id} no encontrado.");
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
        public async Task<IActionResult> DeleteIngrediente(int id)
        {
            try
            {
                var ingrediente = await _context.Ingredientes.FindAsync(id);
                if (ingrediente == null)
                {
                    return NotFound($"Ingrediente con ID {id} no encontrado.");
                }

                _context.Ingredientes.Remove(ingrediente);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        private bool IngredienteExists(int id)
        {
            return _context.Ingredientes.Any(e => e.idIngrediente == id);
        }
    }
}
