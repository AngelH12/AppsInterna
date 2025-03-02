using System.ComponentModel.DataAnnotations; 

namespace TiendaAPI.Models
{
    public class Combo
    {
        [Key] 
        public int idCombo { get; set; }

        public string? nombre { get; set; }
        public string? descripcion { get; set; }
        public decimal? precio { get; set; }
        public bool? activo { get; set; }
    }
}
