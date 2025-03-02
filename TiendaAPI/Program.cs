using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);

try
{
    // Add DbContext service with exception handling
    builder.Services.AddDbContext<TiendaDbContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
}
catch (Exception ex)
{
    Console.WriteLine($"Error setting up DbContext: {ex.Message}");
    throw; // Re-throw the exception after logging it
}

try
{
    // Add OpenAPI service with exception handling
    builder.Services.AddOpenApi();
}
catch (Exception ex)
{
    Console.WriteLine($"Error adding OpenAPI service: {ex.Message}");
    throw; // Re-throw the exception after logging it
}

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    try
    {
        app.MapOpenApi();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error configuring OpenAPI in development: {ex.Message}");
        throw;
    }
}

app.UseHttpsRedirection();

app.MapPost("/usuarios", async (TiendaDbContext db, Usuario usuario) =>
{
    try
    {
        db.Usuarios.Add(usuario);
        await db.SaveChangesAsync();
        return Results.Created($"/usuarios/{usuario.IdUsuario}", usuario);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error al crear usuario: {ex.Message}");
    }
}).WithName("CreateUsuario");


app.MapPost("/usuarios", async (68TiendaDbContext db, Usuario usuario) =>
{
    try
    {
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
    try
    {
        var usuario = await db.Usuarios.FindAsync(id);
        if (usuario == null) return Results.NotFound();

        db.Usuarios.Remove(usuario);
        await db.SaveChangesAsync();

        return Results.NoContent();
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error al eliminar usuario: {ex.Message}");
    }
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



//app.MapGet("/ingredientes", async (TiendaDbContext db) =>
//{
//    try
//    {
//        if (!await db.Database.CanConnectAsync())
//        {
//            return Results.Problem("No se pudo conectar a la base de datos.");
//        }

//        var ingredientes = await db.Ingredientes.ToListAsync(); // ✅ Usa el nombre correcto
//        return Results.Ok(ingredientes);
//    }
//    catch (Exception ex)
//    {
//        return Results.Problem($"Error al obtener Ingredientes: {ex.Message}");
//    }
//}).WithName("GetIngredientes");




app.Run();
