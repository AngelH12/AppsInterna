using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TiendaAPI.Models
{
    [Table("DetalleCombo")] 
    public class DetalleCombo
    {
        [Key]
        public int idDetalleCombo { get; set; }

        [ForeignKey("Combo")]
        public int? idCombo { get; set; }
        public Combo? Combo { get; set; }

        [ForeignKey("Producto")]
        public int idProducto { get; set; }
        public Producto? Producto { get; set; }

        public int cantidad { get; set; }
    }
}
