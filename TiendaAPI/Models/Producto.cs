namespace TiendaAPI.Models;

public class Producto
{
    public int idProducto { get; set; }
    public string nombre { get; set; }
    public string descripcion { get; set; }
    public decimal precio { get; set; }
    public string tipoProducto { get; set; }
    public int stock { get; set; }
    public string unidadMedida { get; set; }
    public string imagen { get; set; }
    public bool activo { get; set; }
}

