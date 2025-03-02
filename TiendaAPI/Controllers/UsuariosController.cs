using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TiendaAPI.Data;
using TiendaAPI.Models;

namespace TiendaAPI.Controllers;

[ApiController]
[Route("api/usuarios")]
public class UsuariosController : ControllerBase
{
    private readonly TiendaDbContext _context;

    public UsuariosController(TiendaDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuarios()
    {
        return await _context.Usuarios.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Usuario>> PostUsuario(Usuario usuario)
    {
        if (usuario == null || string.IsNullOrEmpty(usuario.Contraseña))
        {
            return BadRequest("La contraseña no puede estar vacía");
        }

        try
        {
            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUsuarios), new { id = usuario.IdUsuario }, usuario);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error al crear usuario: {ex.Message}");
        }
    }

}
