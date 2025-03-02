using System.ComponentModel.DataAnnotations;

namespace TiendaAPI.Models
{
    public class Proveedor
    {
        [Key]
        public int idProveedor { get; set; }

        [Required, StringLength(100)]
        public string nombre { get; set; }

        [StringLength(50)]
        public string? telefono { get; set; }

        [StringLength(255)]
        public string? direccion { get; set; }

        [EmailAddress, StringLength(100)]
        public string? correo { get; set; }

        [StringLength(50)]
        public string? tipoProducto { get; set; }
    }
}
