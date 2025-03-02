using System;
using System.ComponentModel.DataAnnotations;

namespace TiendaAPI.Models
{
    public class Reserva
    {
        [Key]
        public int idReserva { get; set; }

        [Required, StringLength(100)]
        public string nombreCliente { get; set; }

        public DateTime fecha { get; set; }

        public int cantidadPersonas { get; set; }

        [StringLength(50)]
        public string estado { get; set; }
    }
}
