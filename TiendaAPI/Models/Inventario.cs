using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TiendaAPI.Models
{
    public class Inventario
    {
        [Key]
        public int idInventario { get; set; }

        [ForeignKey("Ingrediente")]
        public int idIngrediente { get; set; }
        public Ingrediente? Ingrediente { get; set; } 

        public int? cantidad { get; set; }

        [StringLength(50)]
        public string? tipoMovimiento { get; set; }

        public DateTime? fechaMovimiento { get; set; } = DateTime.Now;

        [StringLength(255)]
        public string? detalle { get; set; } 
    }
}
