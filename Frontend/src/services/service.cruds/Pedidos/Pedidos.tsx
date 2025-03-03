import { EnvioInterface, PedidoInterface } from "interfaces/Pedidos/Pedidos";
import { deleteById, get, patch, post, put, remove } from "services/services.methods";
import { PedidosPaths } from "services/services.paths";

export const PedidoService = async () => {
  const response = await get<PedidoInterface>(PedidosPaths.get);

  return response;
};


export const CreateroPedido = async (payload: any) => {
  const response = await post<PedidoInterface>(PedidosPaths.post, payload);

  return response;
};

export const DeletedPedido = async (id: number) => {

  const response = await deleteById<PedidoInterface>(PedidosPaths.delete, id);
  return response;
};


export const UpdatePedido = async (id: number, data: any) => {
  const response = await put<PedidoInterface>(
    PedidosPaths.put + `/${id}`, data);

  return response;
};



