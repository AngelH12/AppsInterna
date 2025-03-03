using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TiendaAPI.Models
{
    public class Pedido
    {
        [Key]
        public int idPedido { get; set; }

        [ForeignKey("Usuario")]
        public int? idUsuario { get; set; }
        public Usuario? Usuario { get; set; } 

        public DateTime? fechaPedido { get; set; } = DateTime.Now;
        public decimal? total { get; set; }
        public string? estado { get; set; }

        public List<DetallePedido> DetallePedidos { get; set; } = new List<DetallePedido>();


    }
}
