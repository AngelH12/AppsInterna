//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;
//using Ingrediente.Models

//namespace DulcesChurrascosAPI.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class IngredientesController : ControllerBase
//    {
//        private readonly DulcesChurrascosDbContext _context;

//        public IngredientesController(DulcesChurrascosDbContext context)
//        {
//            _context = context;
//        }

//        // GET: api/ingredientes
//        [HttpGet]
//        public async Task<ActionResult<IEnumerable<Ingrediente>>> GetIngredientes()
//        {
//            return await _context.Ingredientes.ToListAsync();
//        }

//        // GET: api/ingredientes/5
//        [HttpGet("{id}")]
//        public async Task<ActionResult<Ingrediente>> GetIngrediente(int id)
//        {
//            var ingrediente = await _context.Ingredientes.FindAsync(id);

//            if (ingrediente == null)
//            {
//                return NotFound();
//            }

//            return ingrediente;
//        }

//        // POST: api/ingredientes
//        [HttpPost]
//        public async Task<ActionResult<Ingrediente>> PostIngrediente(Ingrediente ingrediente)
//        {
//            _context.Ingredientes.Add(ingrediente);
//            await _context.SaveChangesAsync();

//            return CreatedAtAction("GetIngrediente", new { id = ingrediente.IdIngrediente }, ingrediente);
//        }

//        // PUT: api/ingredientes/5
//        [HttpPut("{id}")]
//        public async Task<IActionResult> PutIngrediente(int id, Ingrediente ingrediente)
//        {
//            if (id != ingrediente.IdIngrediente)
//            {
//                return BadRequest();
//            }

//            _context.Entry(ingrediente).State = EntityState.Modified;

//            try
//            {
//                await _context.SaveChangesAsync();
//            }
//            catch (DbUpdateConcurrencyException)
//            {
//                if (!_context.Ingredientes.Any(e => e.IdIngrediente == id))
//                {
//                    return NotFound();
//                }
//                else
//                {
//                    throw;
//                }
//            }

//            return NoContent();
//        }

//        // DELETE: api/ingredientes/5
//        [HttpDelete("{id}")]
//        public async Task<IActionResult> DeleteIngrediente(int id)
//        {
//            var ingrediente = await _context.Ingredientes.FindAsync(id);
//            if (ingrediente == null)
//            {
//                return NotFound();
//            }

//            _context.Ingredientes.Remove(ingrediente);
//            await _context.SaveChangesAsync();

//            return NoContent();
//        }
//    }
//}
