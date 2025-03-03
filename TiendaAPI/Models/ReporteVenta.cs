using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TiendaAPI.Models
{
    public class ReporteVenta
    {
        [Key]
        public int IdReporte { get; set; }

        [Required]
        [ForeignKey(nameof(Sucursal))] 
        public int IdSucursal { get; set; }

        public DateTime? Fecha { get; set; } = DateTime.Now;
        public decimal? TotalVentas { get; set; }
        public int? ProductosVendidos { get; set; }

        public virtual Sucursal? Sucursal { get; set; } 
    }
}
