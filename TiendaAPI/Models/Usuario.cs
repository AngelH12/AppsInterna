namespace TiendaAPI.Models;

public class Usuario
{
    public int IdUsuario { get; set; }
    public string? Nombre { get; set; }
    public string? Correo { get; set; }
    public string? Contrase�a { get; set; }
    public string? Rol { get; set; }
}
