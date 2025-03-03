import { InventarioInterface } from "interfaces/Ingrediente/Ingrediente";
import { deleteById, get, patch, post, put, remove } from "services/services.methods";
import { InventarioPaths } from "services/services.paths";

export const InventarioService = async () => {
  const response = await get<InventarioInterface>(InventarioPaths.get);

  return response;
};


export const CreaterInventario = async (payload: any) => {
  const response = await post<InventarioInterface>(InventarioPaths.post, payload);

  return response;
};

export const DeletedInventario = async (id: number) => {

  const response = await deleteById<InventarioInterface>(InventarioPaths.delete, id);
  return response;
};


export const UpdateGInventario = async (id: number, data: any) => {
  const response = await put<InventarioInterface>(
    InventarioPaths.put + `/${id}`, data);

  return response;
};



