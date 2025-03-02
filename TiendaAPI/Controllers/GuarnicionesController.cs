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
    public class GuarnicionesController : ControllerBase
    {
        private readonly TiendaDbContext _context;

        public GuarnicionesController(TiendaDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Guarnicion>>> GetGuarniciones()
        {
            try
            {
                var guarniciones = await _context.Guarniciones.ToListAsync();
                return Ok(guarniciones);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Guarnicion>> GetGuarnicion(int id)
        {
            try
            {
                var guarnicion = await _context.Guarniciones.FindAsync(id);
                if (guarnicion == null)
                {
                    return NotFound($"Guarnición con ID {id} no encontrada.");
                }

                return Ok(guarnicion);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Guarnicion>> PostGuarnicion(Guarnicion guarnicion)
        {
            try
            {
                if (guarnicion == null)
                {
                    return BadRequest("La guarnición no puede ser nula.");
                }

                _context.Guarniciones.Add(guarnicion);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetGuarnicion), new { id = guarnicion.idGuarnicion }, guarnicion);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutGuarnicion(int id, Guarnicion guarnicion)
        {
            if (id != guarnicion.idGuarnicion)
            {
                return BadRequest("El ID de la guarnición no coincide.");
            }

            try
            {
                _context.Entry(guarnicion).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GuarnicionExists(id))
                {
                    return NotFound($"Guarnición con ID {id} no encontrada.");
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
        public async Task<IActionResult> DeleteGuarnicion(int id)
        {
            try
            {
                var guarnicion = await _context.Guarniciones.FindAsync(id);
                if (guarnicion == null)
                {
                    return NotFound($"Guarnición con ID {id} no encontrada.");
                }

                _context.Guarniciones.Remove(guarnicion);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        private bool GuarnicionExists(int id)
        {
            return _context.Guarniciones.Any(e => e.idGuarnicion == id);
        }
    }
}
