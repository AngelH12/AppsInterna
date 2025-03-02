import { Login, LoginResponse } from "interfaces";
import { post } from "services/services.methods";
import { LoginPaths } from "services/services.paths";

export const LoginService = async (payload: Login) => {
  const response = await post<LoginResponse>(LoginPaths.login, payload);

  return response;
};
