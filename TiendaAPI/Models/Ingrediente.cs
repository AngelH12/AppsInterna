using System.ComponentModel.DataAnnotations; 

namespace TiendaAPI.Models
{
    public class Ingrediente
    {
        [Key] 
        public int idIngrediente { get; set; }

        public string? nombre { get; set; }
        public int? stock { get; set; }
        public string? unidadMedida { get; set; }
        public string? tipo { get; set; }
        public decimal? precioUnitario { get; set; }
        public bool? activo { get; set; }
    }
}
