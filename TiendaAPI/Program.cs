    using Microsoft.EntityFrameworkCore;
    using TiendaAPI.Data;
    using TiendaAPI.Models;

    var builder = WebApplication.CreateBuilder(args);

    builder.Services.AddDbContext<TiendaDbContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

    builder.Services.AddOpenApi();

    var app = builder.Build();

    if (app.Environment.IsDevelopment())
    {
        app.MapOpenApi();
    }

    app.UseHttpsRedirection();

app.MapGet("/usuarios", async (TiendaDbContext db) =>
{
    try
    {
        if (!await db.Database.CanConnectAsync())
        {
            return Results.Problem("No se pudo conectar a la base de datos.");
        }

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
        db.Usuarios.Add(usuario);
        await db.SaveChangesAsync();
        return Results.Created($"/usuarios/{usuario.IdUsuario}", usuario);
    }).WithName("CreateUsuario");

    app.MapDelete("/usuarios/{id}", async (TiendaDbContext db, int id) =>
    {
        var usuario = await db.Usuarios.FindAsync(id);
        if (usuario == null) return Results.NotFound();

        db.Usuarios.Remove(usuario);
        await db.SaveChangesAsync();    

        return Results.NoContent();
    }).WithName("DeleteUsuario");

    app.Run();
