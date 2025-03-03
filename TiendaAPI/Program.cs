using Microsoft.EntityFrameworkCore;
using TiendaAPI.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using BCrypt.Net;
using TiendaAPI.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<TiendaDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});



var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var key = Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidateAudience = true,
            ValidAudience = jwtSettings["Audience"],
            ValidateLifetime = true
        };
    });

var app = builder.Build();

app.UseCors("AllowAllOrigins");
app.UseHttpsRedirection();
app.UseAuthentication();
//app.UseAuthorization();


app.MapPost("/login", async (TiendaDbContext db, UsuarioLogin login) =>
{
    var user = await db.Usuarios.FirstOrDefaultAsync(u => u.Correo == login.Correo);

    if (user == null)
    {
        return Results.Json(new { message = "El usuario no está registrado." }, statusCode: 404);
    }

    if (!BCrypt.Net.BCrypt.Verify(login.Contraseña, user.Contraseña))
    {
        return Results.Json(new { message = "Credenciales incorrectas." }, statusCode: 401);
    }

    var claims = new List<Claim>
    {
        new Claim(ClaimTypes.Name, user.Nombre ?? ""),
        new Claim(ClaimTypes.Email, user.Correo ?? ""),
        new Claim(ClaimTypes.Role, user.Rol?.Trim() ?? "")
    };

    var secretKey = jwtSettings["SecretKey"];
    var key = Encoding.UTF8.GetBytes(secretKey);
    var creds = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        issuer: jwtSettings["Issuer"],
        audience: jwtSettings["Audience"],
        claims: claims,
        expires: DateTime.UtcNow.AddMinutes(60),
        signingCredentials: creds
    );

    return Results.Ok(new
    {
        message = "Inicio de sesión exitoso.",
        Token = new JwtSecurityTokenHandler().WriteToken(token),
        Rol = user.Rol?.Trim()
    });
}).WithName("Login");


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
    var usuarioExistente = await db.Usuarios.FirstOrDefaultAsync(u => u.Correo == usuario.Correo);
    if (usuarioExistente != null)
    {
        return Results.Conflict(new
        {
            success = false,
            message = $"El correo {usuario.Correo} ya está registrado."
        });
    }

    usuario.Contraseña = BCrypt.Net.BCrypt.HashPassword(usuario.Contraseña);

    db.Usuarios.Add(usuario);
    await db.SaveChangesAsync();

    return Results.Created($"/usuarios/{usuario.IdUsuario}", new
    {
        success = true,
        message = "Usuario creado exitosamente.",
        usuario
    });
}).WithName("CreateUsuario");

app.MapPut("/usuarios/{id}", async (TiendaDbContext db, int id, Usuario usuario) =>
{
    if (id != usuario.IdUsuario)
    {
        return Results.BadRequest(new
        {
            success = false,
            message = "El ID en la URL no coincide con el ID del usuario."
        });
    }

    var usuarioExistente = await db.Usuarios.FindAsync(id);
    if (usuarioExistente == null)
    {
        return Results.NotFound(new
        {
            success = false,
            message = $"Usuario con ID {id} no encontrado."
        });
    }

    db.Entry(usuarioExistente).CurrentValues.SetValues(usuario);
    await db.SaveChangesAsync();

    return Results.Ok(new
    {
        success = true,
        message = "Usuario actualizado correctamente."
    });
}).WithName("UpdateUsuario");

app.MapDelete("/usuarios/{id}", async (TiendaDbContext db, int id) =>
{
    var usuario = await db.Usuarios.FindAsync(id);
    if (usuario == null)
    {
        return Results.NotFound(new
        {
            success = false,
            message = $"Usuario con ID {id} no encontrado."
        });
    }

    db.Usuarios.Remove(usuario);
    await db.SaveChangesAsync();

    return Results.Ok(new
    {
        success = true,
        message = "Usuario eliminado exitosamente."
    });
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
    var productoExistente = await db.Productos.FirstOrDefaultAsync(p => p.Nombre == producto.Nombre);
    if (productoExistente != null)
    {
        return Results.Conflict(new { message = $"El producto {producto.Nombre} ya está registrado." });
    }

    db.Productos.Add(producto);
    await db.SaveChangesAsync();

    return Results.Ok(new
    {
        success = true,
        message = "Accion creada correctamente."
    });
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
    return Results.Ok(new
    {
        success = true,
        message = "Accion creada correctamente."
    });
}).WithName("UpdateProducto");

app.MapDelete("/productos/{id}", async (TiendaDbContext db, int id) =>
{
    var producto = await db.Productos.FindAsync(id);
    if (producto == null) return Results.NotFound($"Producto con ID {id} no encontrado.");

    db.Productos.Remove(producto);
    await db.SaveChangesAsync();
    return Results.Ok(new
    {
        success = true,
        message = "Accion creada correctamente."
    });
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
    var guarnicionExistente = await db.Guarniciones.FirstOrDefaultAsync(g => g.nombre == guarnicion.nombre);
    if (guarnicionExistente != null)
    {
        return Results.Conflict($"La guarnición {guarnicion.nombre} ya está registrada.");
    }

    db.Guarniciones.Add(guarnicion);
    await db.SaveChangesAsync();
    return Results.Ok(new
    {
        success = true,
        message = "Accion creada correctamente."
    });
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
    return Results.Ok(new
    {
        success = true,
        message = "Accion creada correctamente."
    });
}).WithName("UpdateGuarnicion");

app.MapDelete("/guarniciones/{id}", async (TiendaDbContext db, int id) =>
{
    var guarnicion = await db.Guarniciones.FindAsync(id);
    if (guarnicion == null) return Results.NotFound($"Guarnición con ID {id} no encontrada.");

    db.Guarniciones.Remove(guarnicion);
    await db.SaveChangesAsync();
    return Results.Ok(new
    {
        success = true,
        message = "Accion creada correctamente."
    });
}).WithName("DeleteGuarnicion");

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
    var comboExistente = await db.Combos.FirstOrDefaultAsync(c => c.nombre == combo.nombre);
    if (comboExistente != null)
    {
        return Results.Conflict($"El combo {combo.nombre} ya está registrado.");
    }

    db.Combos.Add(combo);
    await db.SaveChangesAsync();
    return Results.Ok(new
    {
        success = true,
        message = "Accion creada correctamente."
    });
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
    return Results.Ok(new
    {
        success = true,
        message = "Accion creada correctamente."
    });
}).WithName("UpdateCombo");

app.MapDelete("/combos/{id}", async (TiendaDbContext db, int id) =>
{
    var combo = await db.Combos.FindAsync(id);
    if (combo == null) return Results.NotFound($"Combo con ID {id} no encontrado.");

    db.Combos.Remove(combo);
    await db.SaveChangesAsync();
    return Results.Ok(new
    {
        success = true,
        message = "Accion creada correctamente."
    });
}).WithName("DeleteCombo");

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

app.MapGet("/detallepedido", async (TiendaDbContext db) =>
{
    try
    {
        var detalles = await db.DetallePedidos
            .Include(dp => dp.Pedido)
            .Include(dp => dp.Producto)
            .ToListAsync();
        return Results.Ok(detalles);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error al obtener DetallePedido: {ex.Message}");
    }
}).WithName("GetDetallePedido");


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

app.MapGet("/inventario", async (TiendaDbContext db) =>
{
    try
    {
        var inventarios = await db.Inventarios
            .Include(i => i.Ingrediente)
            .ToListAsync();
        return Results.Ok(inventarios);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error al obtener Inventario: {ex.Message}");
    }
}).WithName("GetInventario");


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

app.MapGet("/proveedores", async (TiendaDbContext db) =>
{
    return Results.Ok(await db.Proveedores.ToListAsync());
}).WithName("GetProveedores");



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

app.MapGet("/reservas", async (TiendaDbContext db) =>
{
    return Results.Ok(await db.Reservas.ToListAsync());
}).WithName("GetReservas");


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

app.MapGet("/envios", async (TiendaDbContext db) =>
{
    return Results.Ok(await db.Envios.Include(e => e.Pedido).ToListAsync());
}).WithName("GetEnvios");


app.MapPost("/envios", async (TiendaDbContext db, Envio envio) =>
{
    var envioExistente = await db.Envios.FirstOrDefaultAsync(e => e.idPedido == envio.idPedido);
    if (envioExistente != null)
    {
        return Results.Conflict($"Ya existe un envío para el pedido con ID {envio.idPedido}.");
    }

    db.Envios.Add(envio);
    await db.SaveChangesAsync();
    return Results.Ok(new
    {
        success = true,
        message = "Accion creada correctamente."
    });
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
    return Results.Ok(new
    {
        success = true,
        message = "Accion creada correctamente."
    });
}).WithName("UpdateEnvio");

app.MapDelete("/envios/{id}", async (TiendaDbContext db, int id) =>
{
    var envio = await db.Envios.FindAsync(id);
    if (envio == null) return Results.NotFound($"Envío con ID {id} no encontrado.");

    db.Envios.Remove(envio);
    await db.SaveChangesAsync();
    return Results.Ok(new
    {
        success = true,
        message = "Accion creada correctamente."
    });
}).WithName("DeleteEnvio");

app.MapGet("/sucursales", async (TiendaDbContext db) => await db.Sucursales.ToListAsync());

app.MapGet("/sucursales/{id}", async (TiendaDbContext db, int id) =>
{
    var sucursal = await db.Sucursales.FindAsync(id);
    return sucursal is not null ? Results.Ok(sucursal) : Results.NotFound();
});

app.MapPost("/sucursales", async (TiendaDbContext db, Sucursal sucursal) =>
{
    db.Sucursales.Add(sucursal);
    await db.SaveChangesAsync();
    return Results.Created($"/sucursales/{sucursal.IdSucursal}", sucursal);
});

app.MapPut("/sucursales/{id}", async (TiendaDbContext db, int id, Sucursal input) =>
{
    var sucursal = await db.Sucursales.FindAsync(id);
    if (sucursal is null) return Results.NotFound();

    sucursal.Nombre = input.Nombre;
    sucursal.Direccion = input.Direccion;
    sucursal.Telefono = input.Telefono;
    sucursal.Activo = input.Activo;

    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.MapDelete("/sucursales/{id}", async (TiendaDbContext db, int id) =>
{
    var sucursal = await db.Sucursales.FindAsync(id);
    if (sucursal is null) return Results.NotFound();

    db.Sucursales.Remove(sucursal);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.MapGet("/reportes", async (TiendaDbContext db) =>
{
    try
    {
        var reportes = await db.ReportesVentas
            .Include(r => r.Sucursal) 
            .ToListAsync();
        return Results.Ok(reportes);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error al obtener reportes: {ex.Message}");
    }
}).WithName("GetReportesVentas");

app.MapGet("/reportes/{id}", async (TiendaDbContext db, int id) =>
{
    var reporte = await db.ReportesVentas.FindAsync(id);
    return reporte is not null ? Results.Ok(reporte) : Results.NotFound();
}).WithName("GetReporteVenta");

app.MapPost("/reportes", async (TiendaDbContext db, ReporteVenta reporte) =>
{
    db.ReportesVentas.Add(reporte);
    await db.SaveChangesAsync();
    return Results.Created($"/reportes/{reporte.IdReporte}", reporte);
}).WithName("CreateReporteVenta");

app.MapPut("/reportes/{id}", async (TiendaDbContext db, int id, ReporteVenta input) =>
{
    var reporte = await db.ReportesVentas.FindAsync(id);
    if (reporte is null) return Results.NotFound();

    reporte.IdSucursal = input.IdSucursal;
    reporte.Fecha = input.Fecha;
    reporte.TotalVentas = input.TotalVentas;

    await db.SaveChangesAsync();
    return Results.NoContent();
}).WithName("UpdateReporteVenta");

app.MapDelete("/reportes/{id}", async (TiendaDbContext db, int id) =>
{
    var reporte = await db.ReportesVentas.FindAsync(id);
    if (reporte is null) return Results.NotFound();

    db.ReportesVentas.Remove(reporte);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).WithName("DeleteReporteVenta");


app.Run();