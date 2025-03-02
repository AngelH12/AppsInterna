using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TiendaAPI.Models
{
    public class DetallePedido
    {
        [Key]
        public int idDetallePedido { get; set; }

        [ForeignKey("Pedido")]
        public int idPedido { get; set; }
        public Pedido? Pedido { get; set; }

        [ForeignKey("Producto")]
        public int idProducto { get; set; }
        public Producto? Producto { get; set; }

        public int cantidad { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? precioUnitario { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? subtotal { get; set; }
    }
}
