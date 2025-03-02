using Microsoft.EntityFrameworkCore;
using TiendaAPI.Models;
using TiendaAPI.Models;

namespace TiendaAPI.Data;

public class TiendaDbContext : DbContext
{
    public TiendaDbContext(DbContextOptions<TiendaDbContext> options) : base(options) { }

    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Producto> Productos { get; set; }
    public DbSet<Ingrediente> Ingredientes { get; set; }
    public DbSet<Guarnicion> Guarniciones { get; set; }
    public DbSet<Combo> Combos { get; set; }
    public DbSet<DetalleCombo> DetalleCombo { get; set; } 
    public DbSet<Pedido> Pedidos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Usuario>().HasKey(u => u.IdUsuario);
        modelBuilder.Entity<Producto>().HasKey(p => p.IdProducto);
        modelBuilder.Entity<Ingrediente>().HasKey(i => i.idIngrediente);

    }
}
