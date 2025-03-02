using Microsoft.EntityFrameworkCore;
using TiendaAPI.Data;
using TiendaAPI.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<TiendaDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));



builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();


app.UseCors("AllowAllOrigins");

app.UseHttpsRedirection();


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

app.MapPost("/usuarios", async (TiendaDbContext db, Usuario usuario) =>
{
    try
    {
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

app.MapGet("/ingredientes", async (TiendaDbContext db) =>
{
    try
    {
        var ingredientes = await db.Ingredientes.ToListAsync();
        return Results.Ok(ingredientes);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error al obtener ingredientes: {ex.Message}");
    }
}).WithName("GetIngredientes");

app.MapPost("/ingredientes", async (TiendaDbContext db, Ingrediente ingrediente) =>
{
    try
    {
        db.Ingredientes.Add(ingrediente);
        await db.SaveChangesAsync();
        return Results.Created($"/ingredientes/{ingrediente.idIngrediente}", ingrediente);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error al crear ingrediente: {ex.Message}");
    }
}).WithName("CreateIngredientes");

app.MapDelete("/ingredientes/{id}", async (TiendaDbContext db, int id) =>
{
    try
    {
        var ingrediente = await db.Ingredientes.FindAsync(id);
        if (ingrediente == null) return Results.NotFound();

        db.Ingredientes.Remove(ingrediente);
        await db.SaveChangesAsync();

        return Results.NoContent();
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error al eliminar ingrediente: {ex.Message}");
    }
}).WithName("DeleteIngredientes");

app.MapGet("/guarniciones", async (TiendaDbContext db) =>
{
    try
    {
        var guarniciones = await db.Guarniciones.ToListAsync();
        return Results.Ok(guarniciones);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error al obtener guarniciones: {ex.Message}");
    }
}).WithName("GetGuarniciones");

app.MapPost("/guarniciones", async (TiendaDbContext db, Guarnicion guarnicion) =>
{
    try
    {
        db.Guarniciones.Add(guarnicion);
        await db.SaveChangesAsync();
        return Results.Created($"/guarniciones/{guarnicion.idGuarnicion}", guarnicion);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error al crear guarnición: {ex.Message}");
    }
}).WithName("CreateGuarniciones");

app.MapDelete("/guarniciones/{id}", async (TiendaDbContext db, int id) =>
{
    try
    {
        var guarnicion = await db.Guarniciones.FindAsync(id);
        if (guarnicion == null) return Results.NotFound();

        db.Guarniciones.Remove(guarnicion);
        await db.SaveChangesAsync();

        return Results.NoContent();
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error al eliminar guarnición: {ex.Message}");
    }
}).WithName("DeleteGuarniciones");

app.MapGet("/combos", async (TiendaDbContext db) =>
{
    try
    {
        var combos = await db.Combos.ToListAsync();
        return Results.Ok(combos);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error al obtener combos: {ex.Message}");
    }
}).WithName("GetCombos");

app.MapPost("/combos", async (TiendaDbContext db, Combo combo) =>
{
    try
    {
        db.Combos.Add(combo);
        await db.SaveChangesAsync();
        return Results.Created($"/combos/{combo.idCombo}", combo);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error al crear combo: {ex.Message}");
    }
}).WithName("CreateCombo");

app.MapDelete("/combos/{id}", async (TiendaDbContext db, int id) =>
{
    try
    {
        var combo = await db.Combos.FindAsync(id);
        if (combo == null) return Results.NotFound();

        db.Combos.Remove(combo);
        await db.SaveChangesAsync();

        return Results.NoContent();
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error al eliminar combo: {ex.Message}");
    }
}).WithName("DeleteCombos");



app.MapGet("/detallecombo", async (TiendaDbContext db) =>
{
    try
    {
        var detalles = await db.DetalleCombo
            .Include(dc => dc.Combo)
            .Include(dc => dc.Producto)
            .ToListAsync();
        return Results.Ok(detalles);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error al obtener DetalleCombo: {ex.Message}");
    }
}).WithName("GetDetalleCombo");

app.MapGet("/detallecombo/{id}", async (TiendaDbContext db, int id) =>
{
    try
    {
        var detalle = await db.DetalleCombo
            .Include(dc => dc.Combo)
            .Include(dc => dc.Producto)
            .FirstOrDefaultAsync(dc => dc.idDetalleCombo == id);

        if (detalle == null)
            return Results.NotFound($"DetalleCombo con ID {id} no encontrado.");

        return Results.Ok(detalle);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error al obtener DetalleCombo: {ex.Message}");
    }
}).WithName("GetDetalleComboById");

app.MapPost("/detallecombo", async (TiendaDbContext db, DetalleCombo detalleCombo) =>
{
    try
    {
        db.DetalleCombo.Add(detalleCombo);
        await db.SaveChangesAsync();
        return Results.Created($"/detallecombo/{detalleCombo.idDetalleCombo}", detalleCombo);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error al crear DetalleCombo: {ex.Message}");
    }
}).WithName("CreateDetalleCombo");

app.MapDelete("/detallecombo/{id}", async (TiendaDbContext db, int id) =>
{
    try
    {
        var detalle = await db.DetalleCombo.FindAsync(id);
        if (detalle == null)
            return Results.NotFound();

        db.DetalleCombo.Remove(detalle);
        await db.SaveChangesAsync();

        return Results.NoContent();
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error al eliminar DetalleCombo: {ex.Message}");
    }
}).WithName("DeleteDetalleCombo");


app.MapGet("/pedidos", async (TiendaDbContext db) =>
{
    try
    {
        var pedidos = await db.Pedidos
            .Include(p => p.Usuario)
            .ToListAsync();
        return Results.Ok(pedidos);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error al obtener pedidos: {ex.Message}");
    }
}).WithName("GetPedidos");

app.MapGet("/pedidos/{id}", async (TiendaDbContext db, int id) =>
{
    try
    {
        var pedido = await db.Pedidos
            .Include(p => p.Usuario)
            .FirstOrDefaultAsync(p => p.idPedido == id);

        if (pedido == null)
            return Results.NotFound($"Pedido con ID {id} no encontrado.");

        return Results.Ok(pedido);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error al obtener pedido: {ex.Message}");
    }
}).WithName("GetPedidoById");

app.MapPost("/pedidos", async (TiendaDbContext db, Pedido pedido) =>
{
    try
    {
        db.Pedidos.Add(pedido);
        await db.SaveChangesAsync();
        return Results.Created($"/pedidos/{pedido.idPedido}", pedido);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error al crear pedido: {ex.Message}");
    }
}).WithName("CreatePedido");

app.MapDelete("/pedidos/{id}", async (TiendaDbContext db, int id) =>
{
    try
    {
        var pedido = await db.Pedidos.FindAsync(id);
        if (pedido == null)
            return Results.NotFound();

        db.Pedidos.Remove(pedido);
        await db.SaveChangesAsync();

        return Results.NoContent();
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error al eliminar pedido: {ex.Message}");
    }
}).WithName("DeletePedido");

app.Run();
