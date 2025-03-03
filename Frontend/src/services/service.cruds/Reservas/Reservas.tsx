import { EnvioInterface } from "interfaces/Pedidos/Pedidos";
import { ReservaInterface } from "interfaces/Reserva/Reserva";
import { deleteById, get, patch, post, put, remove } from "services/services.methods";
import { ReservasPaths } from "services/services.paths";

export const Reservaservice = async () => {
  const response = await get<ReservaInterface>(ReservasPaths.get);

  return response;
};


export const CreateroReservas = async (payload: any) => {
  const response = await post<ReservaInterface>(ReservasPaths.post, payload);

  return response;
};

export const DeletedReservas = async (id: number) => {

  const response = await deleteById<ReservaInterface>(ReservasPaths.delete, id);
  return response;
};


export const UpdateReservas = async (id: number, data: any) => {
  const response = await put<ReservaInterface>(
    ReservasPaths.put + `/${id}`, data);

  return response;
};





