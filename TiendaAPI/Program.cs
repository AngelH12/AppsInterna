using Microsoft.EntityFrameworkCore;
using TiendaAPI.Data;
using TiendaAPI.Models;

var builder = WebApplication.CreateBuilder(args);

// Configuración de la base de datos
builder.Services.AddDbContext<TiendaDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();



app.UseHttpsRedirection();

// Endpoint para obtener todos los usuarios
app.MapGet("/usuarios", async (TiendaDbContext db) =>
{
    try
    {
        var usuarios = await db.Usuarios.ToListAsync();
        return Results.Ok(usuarios);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error al obtener usuarios: {ex.Message}");
    }
}).WithName("GetUsuarios");

// Endpoint para crear un nuevo usuario
app.MapPost("/usuarios", async (TiendaDbContext db, Usuario usuario) =>
{
    try
    {
        // Verificar si el correo ya existe en la base de datos
        var usuarioExistente = await db.Usuarios.FirstOrDefaultAsync(u => u.Correo == usuario.Correo);
        if (usuarioExistente != null)
        {
            return Results.Conflict($"El correo {usuario.Correo} ya está registrado.");
        }

        db.Usuarios.Add(usuario);
        await db.SaveChangesAsync();
        return Results.Created($"/usuarios/{usuario.IdUsuario}", usuario);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error al crear usuario: {ex.Message}");
    }
}).WithName("CreateUsuario");


// Endpoint para eliminar un usuario por ID
app.MapDelete("/usuarios/{id}", async (TiendaDbContext db, int id) =>
{
    var usuario = await db.Usuarios.FindAsync(id);
    if (usuario == null) return Results.NotFound();

    db.Usuarios.Remove(usuario);
    await db.SaveChangesAsync();

    return Results.NoContent();
}).WithName("DeleteUsuario");


app.MapGet("/productos", async (TiendaDbContext db) =>
{
    try
    {
        if (!await db.Database.CanConnectAsync())
        {
            return Results.Problem("No se pudo conectar a la base de datos.");
        }

        var productos = await db.Productos.ToListAsync();
        return Results.Ok(productos);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error al obtener productos: {ex.Message}");
    }
}).WithName("GetProductos");

app.MapPost("/productos", async (TiendaDbContext db, Producto producto) =>
{
    try
    {
        db.Productos.Add(producto);
        await db.SaveChangesAsync();
        return Results.Created($"/productos/{producto.IdProducto}", producto);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error al crear producto: {ex.Message}");
    }
}).WithName("CreateProducto");

app.MapDelete("/productos/{id}", async (TiendaDbContext db, int id) =>
{
    try
    {
        var producto = await db.Productos.FindAsync(id);
        if (producto == null) return Results.NotFound();

        db.Productos.Remove(producto);
        await db.SaveChangesAsync();

        return Results.NoContent();
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error al eliminar producto: {ex.Message}");
    }
}).WithName("DeleteProducto");

app.Run();
