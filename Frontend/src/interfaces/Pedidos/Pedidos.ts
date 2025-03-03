export interface EnvioInterface {
    idEnvio: number;
    idPedido: number;
    pedido: PedidoInterface;
    direccion: string;
    telefono: string;
    estado: string;
}

export interface PedidoInterface {
    idPedido: number;
    idUsuario: number;
    usuario: any | null; 
    fechaPedido: string; 
    total: number;
    estado: string;
}
