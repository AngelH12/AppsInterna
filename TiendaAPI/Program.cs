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


app.MapPost("/usuarios", async (TiendaDbContext db, Usuario usuario) =>
{
    var usuarioExistente = await db.Usuarios.FirstOrDefaultAsync(u => u.Correo == usuario.Correo);
    if (usuarioExistente != null)
    {
        return Results.Conflict($"El correo {usuario.Correo} ya está registrado.");
    }

    db.Usuarios.Add(usuario);
    await db.SaveChangesAsync();
    return Results.Created($"/usuarios/{usuario.IdUsuario}", usuario);
}).WithName("CreateUsuario");

app.MapPut("/usuarios/{id}", async (TiendaDbContext db, int id, Usuario usuario) =>
{
    if (id != usuario.IdUsuario)
    {
        return Results.BadRequest("El ID en la URL no coincide con el ID del usuario.");
    }

    var usuarioExistente = await db.Usuarios.FindAsync(id);
    if (usuarioExistente == null)
    {
        return Results.NotFound($"Usuario con ID {id} no encontrado.");
    }

    db.Entry(usuarioExistente).CurrentValues.SetValues(usuario);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).WithName("UpdateUsuario");

app.MapDelete("/usuarios/{id}", async (TiendaDbContext db, int id) =>
{
    var usuario = await db.Usuarios.FindAsync(id);
    if (usuario == null) return Results.NotFound($"Usuario con ID {id} no encontrado.");

    db.Usuarios.Remove(usuario);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).WithName("DeleteUsuario");


app.MapPost("/productos", async (TiendaDbContext db, Producto producto) =>
{
    var productoExistente = await db.Productos.FirstOrDefaultAsync(p => p.Nombre == producto.Nombre);
    if (productoExistente != null)
    {
        return Results.Conflict($"El producto {producto.Nombre} ya está registrado.");
    }

    db.Productos.Add(producto);
    await db.SaveChangesAsync();
    return Results.Created($"/productos/{producto.IdProducto}", producto);
}).WithName("CreateProducto");

app.MapPut("/productos/{id}", async (TiendaDbContext db, int id, Producto producto) =>
{
    if (id != producto.IdProducto)
    {
        return Results.BadRequest("El ID en la URL no coincide con el ID del producto.");
    }

    var productoExistente = await db.Productos.FindAsync(id);
    if (productoExistente == null)
    {
        return Results.NotFound($"Producto con ID {id} no encontrado.");
    }

    db.Entry(productoExistente).CurrentValues.SetValues(producto);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).WithName("UpdateProducto");

app.MapDelete("/productos/{id}", async (TiendaDbContext db, int id) =>
{
    var producto = await db.Productos.FindAsync(id);
    if (producto == null) return Results.NotFound($"Producto con ID {id} no encontrado.");

    db.Productos.Remove(producto);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).WithName("DeleteProducto");



app.MapPost("/ingredientes", async (TiendaDbContext db, Ingrediente ingrediente) =>
{
    var ingredienteExistente = await db.Ingredientes.FirstOrDefaultAsync(i => i.nombre == ingrediente.nombre);
    if (ingredienteExistente != null)
    {
        return Results.Conflict($"El ingrediente {ingrediente.nombre} ya está registrado.");
    }

    db.Ingredientes.Add(ingrediente);
    await db.SaveChangesAsync();
    return Results.Created($"/ingredientes/{ingrediente.idIngrediente}", ingrediente);
}).WithName("CreateIngrediente");

app.MapPut("/ingredientes/{id}", async (TiendaDbContext db, int id, Ingrediente ingrediente) =>
{
    if (id != ingrediente.idIngrediente)
    {
        return Results.BadRequest("El ID en la URL no coincide con el ID del ingrediente.");
    }

    var ingredienteExistente = await db.Ingredientes.FindAsync(id);
    if (ingredienteExistente == null)
    {
        return Results.NotFound($"Ingrediente con ID {id} no encontrado.");
    }

    db.Entry(ingredienteExistente).CurrentValues.SetValues(ingrediente);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).WithName("UpdateIngrediente");

app.MapDelete("/ingredientes/{id}", async (TiendaDbContext db, int id) =>
{
    var ingrediente = await db.Ingredientes.FindAsync(id);
    if (ingrediente == null) return Results.NotFound($"Ingrediente con ID {id} no encontrado.");

    db.Ingredientes.Remove(ingrediente);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).WithName("DeleteIngrediente");


app.MapPost("/guarniciones", async (TiendaDbContext db, Guarnicion guarnicion) =>
{
    var guarnicionExistente = await db.Guarniciones.FirstOrDefaultAsync(g => g.nombre == guarnicion.nombre);
    if (guarnicionExistente != null)
    {
        return Results.Conflict($"La guarnición {guarnicion.nombre} ya está registrada.");
    }

    db.Guarniciones.Add(guarnicion);
    await db.SaveChangesAsync();
    return Results.Created($"/guarniciones/{guarnicion.idGuarnicion}", guarnicion);
}).WithName("CreateGuarnicion");

app.MapPut("/guarniciones/{id}", async (TiendaDbContext db, int id, Guarnicion guarnicion) =>
{
    var guarnicionExistente = await db.Guarniciones.FindAsync(id);
    if (guarnicionExistente == null)
    {
        return Results.NotFound($"Guarnición con ID {id} no encontrada.");
    }

    db.Entry(guarnicionExistente).CurrentValues.SetValues(guarnicion);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).WithName("UpdateGuarnicion");

app.MapDelete("/guarniciones/{id}", async (TiendaDbContext db, int id) =>
{
    var guarnicion = await db.Guarniciones.FindAsync(id);
    if (guarnicion == null) return Results.NotFound($"Guarnición con ID {id} no encontrada.");

    db.Guarniciones.Remove(guarnicion);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).WithName("DeleteGuarnicion");


app.MapPost("/combos", async (TiendaDbContext db, Combo combo) =>
{
    var comboExistente = await db.Combos.FirstOrDefaultAsync(c => c.nombre == combo.nombre);
    if (comboExistente != null)
    {
        return Results.Conflict($"El combo {combo.nombre} ya está registrado.");
    }

    db.Combos.Add(combo);
    await db.SaveChangesAsync();
    return Results.Created($"/combos/{combo.idCombo}", combo);
}).WithName("CreateCombo");

app.MapPut("/combos/{id}", async (TiendaDbContext db, int id, Combo combo) =>
{
    var comboExistente = await db.Combos.FindAsync(id);
    if (comboExistente == null)
    {
        return Results.NotFound($"Combo con ID {id} no encontrado.");
    }

    db.Entry(comboExistente).CurrentValues.SetValues(combo);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).WithName("UpdateCombo");

app.MapDelete("/combos/{id}", async (TiendaDbContext db, int id) =>
{
    var combo = await db.Combos.FindAsync(id);
    if (combo == null) return Results.NotFound($"Combo con ID {id} no encontrado.");

    db.Combos.Remove(combo);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).WithName("DeleteCombo");


app.MapPost("/detallecombo", async (TiendaDbContext db, DetalleCombo detalleCombo) =>
{
    db.DetalleCombo.Add(detalleCombo);
    await db.SaveChangesAsync();
    return Results.Created($"/detallecombo/{detalleCombo.idDetalleCombo}", detalleCombo);
}).WithName("CreateDetalleCombo");

app.MapDelete("/detallecombo/{id}", async (TiendaDbContext db, int id) =>
{
    var detalle = await db.DetalleCombo.FindAsync(id);
    if (detalle == null) return Results.NotFound($"DetalleCombo con ID {id} no encontrado.");

    db.DetalleCombo.Remove(detalle);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).WithName("DeleteDetalleCombo");


app.MapPost("/pedidos", async (TiendaDbContext db, Pedido pedido) =>
{
    db.Pedidos.Add(pedido);
    await db.SaveChangesAsync();
    return Results.Created($"/pedidos/{pedido.idPedido}", pedido);
}).WithName("CreatePedido");

app.MapDelete("/pedidos/{id}", async (TiendaDbContext db, int id) =>
{
    var pedido = await db.Pedidos.FindAsync(id);
    if (pedido == null) return Results.NotFound($"Pedido con ID {id} no encontrado.");

    db.Pedidos.Remove(pedido);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).WithName("DeletePedido");


app.MapPost("/detallepedido", async (TiendaDbContext db, DetallePedido detalle) =>
{
    db.DetallePedidos.Add(detalle);
    await db.SaveChangesAsync();
    return Results.Created($"/detallepedido/{detalle.idDetallePedido}", detalle);
}).WithName("CreateDetallePedido");

app.MapDelete("/detallepedido/{id}", async (TiendaDbContext db, int id) =>
{
    var detalle = await db.DetallePedidos.FindAsync(id);
    if (detalle == null) return Results.NotFound($"DetallePedido con ID {id} no encontrado.");

    db.DetallePedidos.Remove(detalle);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).WithName("DeleteDetallePedido");


app.MapPost("/inventario", async (TiendaDbContext db, Inventario inventario) =>
{
    db.Inventarios.Add(inventario);
    await db.SaveChangesAsync();
    return Results.Created($"/inventario/{inventario.idInventario}", inventario);
}).WithName("CreateInventario");

app.MapDelete("/inventario/{id}", async (TiendaDbContext db, int id) =>
{
    var inventario = await db.Inventarios.FindAsync(id);
    if (inventario == null) return Results.NotFound($"Inventario con ID {id} no encontrado.");

    db.Inventarios.Remove(inventario);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).WithName("DeleteInventario");


app.MapPost("/proveedores", async (TiendaDbContext db, Proveedor proveedor) =>
{
    var proveedorExistente = await db.Proveedores.FirstOrDefaultAsync(p => p.nombre == proveedor.nombre);
    if (proveedorExistente != null)
    {
        return Results.Conflict($"El proveedor {proveedor.nombre} ya está registrado.");
    }

    db.Proveedores.Add(proveedor);
    await db.SaveChangesAsync();
    return Results.Created($"/proveedores/{proveedor.idProveedor}", proveedor);
}).WithName("CreateProveedor");

app.MapDelete("/proveedores/{id}", async (TiendaDbContext db, int id) =>
{
    var proveedor = await db.Proveedores.FindAsync(id);
    if (proveedor == null) return Results.NotFound($"Proveedor con ID {id} no encontrado.");

    db.Proveedores.Remove(proveedor);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).WithName("DeleteProveedor");

app.MapPost("/reservas", async (TiendaDbContext db, Reserva reserva) =>
{
    var reservaExistente = await db.Reservas.FirstOrDefaultAsync(r =>
        r.nombreCliente == reserva.nombreCliente && r.fecha == reserva.fecha);
    if (reservaExistente != null)
    {
        return Results.Conflict($"Ya existe una reserva para {reserva.nombreCliente} en la fecha {reserva.fecha}.");
    }

    db.Reservas.Add(reserva);
    await db.SaveChangesAsync();
    return Results.Created($"/reservas/{reserva.idReserva}", reserva);
}).WithName("CreateReserva");

app.MapPut("/reservas/{id}", async (TiendaDbContext db, int id, Reserva reserva) =>
{
    if (id != reserva.idReserva)
    {
        return Results.BadRequest("El ID en la URL no coincide con el ID de la reserva.");
    }

    var reservaExistente = await db.Reservas.FindAsync(id);
    if (reservaExistente == null)
    {
        return Results.NotFound($"Reserva con ID {id} no encontrada.");
    }

    db.Entry(reservaExistente).CurrentValues.SetValues(reserva);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).WithName("UpdateReserva");

app.MapDelete("/reservas/{id}", async (TiendaDbContext db, int id) =>
{
    var reserva = await db.Reservas.FindAsync(id);
    if (reserva == null) return Results.NotFound($"Reserva con ID {id} no encontrada.");

    db.Reservas.Remove(reserva);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).WithName("DeleteReserva");


app.MapPost("/envios", async (TiendaDbContext db, Envio envio) =>
{
    var envioExistente = await db.Envios.FirstOrDefaultAsync(e => e.idPedido == envio.idPedido);
    if (envioExistente != null)
    {
        return Results.Conflict($"Ya existe un envío para el pedido con ID {envio.idPedido}.");
    }

    db.Envios.Add(envio);
    await db.SaveChangesAsync();
    return Results.Created($"/envios/{envio.idEnvio}", envio);
}).WithName("CreateEnvio");

app.MapPut("/envios/{id}", async (TiendaDbContext db, int id, Envio envio) =>
{
    if (id != envio.idEnvio)
    {
        return Results.BadRequest("El ID en la URL no coincide con el ID del envío.");
    }

    var envioExistente = await db.Envios.FindAsync(id);
    if (envioExistente == null)
    {
        return Results.NotFound($"Envío con ID {id} no encontrado.");
    }

    db.Entry(envioExistente).CurrentValues.SetValues(envio);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).WithName("UpdateEnvio");

app.MapDelete("/envios/{id}", async (TiendaDbContext db, int id) =>
{
    var envio = await db.Envios.FindAsync(id);
    if (envio == null) return Results.NotFound($"Envío con ID {id} no encontrado.");

    db.Envios.Remove(envio);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).WithName("DeleteEnvio");

app.Run();
