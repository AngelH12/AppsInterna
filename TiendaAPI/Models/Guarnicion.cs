using System.ComponentModel.DataAnnotations;

namespace TiendaAPI.Models
{
    public class Guarnicion
    {
        [Key] 
        public int idGuarnicion { get; set; }

        public string? nombre { get; set; }
        public decimal? precio { get; set; }
        public int? stock { get; set; }
        public bool? activo { get; set; }
    }
}
