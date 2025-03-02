import { UsuarioInterface } from "interfaces/user";
import { deleteById, get, patch, post, put, remove } from "services/services.methods";
import { UserPaths } from "services/services.paths";

export const UserService = async () => {
  const response = await get<UsuarioInterface>(UserPaths.get);

  return response;
};


export const CreaterUser = async (payload: any) => {
  const response = await post<UsuarioInterface>(UserPaths.post, payload);

  return response;
};

export const DeletedUser = async (id: number) => {

  const response = await deleteById<UsuarioInterface>(UserPaths.delete, id);
  return response;
};


export const UpdateUser = async (id: number, data: any) => {
  const response = await put<UsuarioInterface>(
    UserPaths.put + `/${id}`, data);

  return response;
};
