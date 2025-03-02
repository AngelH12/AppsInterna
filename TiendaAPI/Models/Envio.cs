using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TiendaAPI.Models
{
    public class Envio
    {
        [Key]
        public int idEnvio { get; set; }

        [ForeignKey("Pedido")]
        public int idPedido { get; set; }
        public Pedido Pedido { get; set; }

        [StringLength(255)]
        public string direccion { get; set; }

        [StringLength(50)]
        public string telefono { get; set; }

        [StringLength(50)]
        public string estado { get; set; }
    }
}
