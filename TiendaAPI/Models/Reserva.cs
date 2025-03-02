namespace TiendaAPI.Models;

public class Reserva
{
    public int idReserva { get; set; }
    public string nombreCliente { get; set; }
    public DateTime fecha { get; set; }
    public int cantidadPersonas { get; set; }
    public string estado { get; set; }
}
