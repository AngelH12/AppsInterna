import { UsuarioInterface } from "interfaces/user";


export interface PedidoInterface {
    idPedido: number;
    idUsuario: number;
    usuario: UsuarioInterface;
    fechaPedido: string;
    total: number;
    estado: string;
}
