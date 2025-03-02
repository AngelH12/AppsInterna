import { ComboInterface } from "interfaces/Combos";
import { GuarnicionInterface } from "interfaces/Guarnicion";
import { deleteById, get, patch, post, put, remove } from "services/services.methods";
import { CombosnPaths } from "services/services.paths";

export const CombosService = async () => {
  const response = await get<ComboInterface>(CombosnPaths.get);

  return response;
};


export const CreaterCombos = async (payload: any) => {
  const response = await post<ComboInterface>(CombosnPaths.post, payload);

  return response;
};

export const DeletedCombos = async (id: number) => {

  const response = await deleteById<ComboInterface>(CombosnPaths.delete, id);
  return response;
};


export const UpdateCombos = async (id: number, data: any) => {
  const response = await put<ComboInterface>(
    CombosnPaths.put + `/${id}`, data);

  return response;
};


