import { ProductoInterface } from "interfaces/Producto/Producto";
import { deleteById, get, patch, post, put, remove } from "services/services.methods";
import { ProductosPaths } from "services/services.paths";

export const ProductosService = async () => {
  const response = await get<ProductoInterface>(ProductosPaths.get);

  return response;
};


export const CreaterProductos = async (payload: any) => {
  const response = await post<ProductoInterface>(ProductosPaths.post, payload);

  return response;
};

export const DeletedProductos = async (id: number) => {

  const response = await deleteById<ProductoInterface>(ProductosPaths.delete, id);
  return response;
};


export const UpdateProductos = async (id: number, data: any) => {
  const response = await put<ProductoInterface>(
    ProductosPaths.put + `/${id}`, data);

  return response;
};