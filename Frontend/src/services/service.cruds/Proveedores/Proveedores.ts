import { ProveedorInterface } from "interfaces/Proveedor/Proveedor";
import { deleteById, get, patch, post, put, remove } from "services/services.methods";
import { ProveedoresPaths } from "services/services.paths";

export const ProveedoresService = async () => {
  const response = await get<ProveedorInterface>(ProveedoresPaths.get);

  return response;
};


export const CreaterProveedores = async (payload: any) => {
  const response = await post<ProveedorInterface>(ProveedoresPaths.post, payload);

  return response;
};

export const DeletedProveedores = async (id: number) => {

  const response = await deleteById<ProveedorInterface>(ProveedoresPaths.delete, id);
  return response;
};


export const UpdateProveedores = async (id: number, data: any) => {
  const response = await put<ProveedorInterface>(
    ProveedoresPaths.put + `/${id}`, data);

  return response;
};


