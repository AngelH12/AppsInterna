using Microsoft.EntityFrameworkCore;
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
    public DbSet<Inventario> Inventarios { get; set; }
    public DbSet<DetallePedido> DetallePedidos { get; set; }

    public DbSet<Proveedor> Proveedores { get; set; }
    public DbSet<Reserva> Reservas { get; set; }
    public DbSet<Envio> Envios { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Usuario>().HasKey(u => u.IdUsuario);
        modelBuilder.Entity<Producto>().HasKey(p => p.IdProducto);
        modelBuilder.Entity<Ingrediente>().HasKey(i => i.idIngrediente);

        modelBuilder.Entity<DetallePedido>().ToTable("DetallePedido");
        modelBuilder.Entity<Inventario>().ToTable("Inventario");

        modelBuilder.Entity<DetallePedido>()
            .HasOne(dp => dp.Pedido)
            .WithMany()
            .HasForeignKey(dp => dp.idPedido)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<DetallePedido>()
            .HasOne(dp => dp.Producto)
            .WithMany()
            .HasForeignKey(dp => dp.idProducto)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Inventario>()
            .HasOne(i => i.Ingrediente)
            .WithMany()
            .HasForeignKey(i => i.idIngrediente)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<DetallePedido>().Property(dp => dp.precioUnitario).HasPrecision(10, 2);
        modelBuilder.Entity<DetallePedido>().Property(dp => dp.subtotal).HasPrecision(10, 2);

        modelBuilder.Entity<Proveedor>().ToTable("Proveedores");
        modelBuilder.Entity<Reserva>().ToTable("Reservas");
        modelBuilder.Entity<Envio>().ToTable("Envios");

        modelBuilder.Entity<Envio>()
            .HasOne(e => e.Pedido)
            .WithMany()
            .HasForeignKey(e => e.idPedido)
            .OnDelete(DeleteBehavior.Restrict);



    }
}
