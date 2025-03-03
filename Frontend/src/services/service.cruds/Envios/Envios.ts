import { EnvioInterface } from "interfaces/Pedidos/Pedidos";
import { deleteById, get, patch, post, put, remove } from "services/services.methods";
import { EnviosPaths } from "services/services.paths";

export const EnvioService = async () => {
  const response = await get<EnvioInterface>(EnviosPaths.get);

  return response;
};


export const CreaterEnvio = async (payload: any) => {
  const response = await post<EnvioInterface>(EnviosPaths.post, payload);

  return response;
};

export const DeletedEnvio = async (id: number) => {

  const response = await deleteById<EnvioInterface>(EnviosPaths.delete, id);
  return response;
};


export const UpdateGEnvio = async (id: number, data: any) => {
  const response = await put<EnvioInterface>(
    EnviosPaths.put + `/${id}`, data);

  return response;
};



