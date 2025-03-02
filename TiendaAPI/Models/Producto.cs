namespace TiendaAPI.Models
{
    public class Producto
    {
        public int IdProducto { get; set; }
        public string? Nombre { get; set; }
        public string? Descripcion { get; set; }
        public decimal? Precio { get; set; }
        public string? TipoProducto { get; set; }
        public int? Stock { get; set; }
        public string? UnidadMedida { get; set; }
        public string? Imagen { get; set; }
        public bool? Activo { get; set; }
    } 
} 
