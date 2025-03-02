import { GuarnicionInterface } from "interfaces/Guarnicion";
import { deleteById, get, patch, post, put, remove } from "services/services.methods";
import { GuarnicionPaths } from "services/services.paths";

export const PGuarnicionService = async () => {
  const response = await get<GuarnicionInterface>(GuarnicionPaths.get);

  return response;
};


export const CreaterPGuarnicion = async (payload: any) => {
  const response = await post<GuarnicionInterface>(GuarnicionPaths.post, payload);

  return response;
};

export const DeletedGuarnicion = async (id: number) => {

  const response = await deleteById<GuarnicionInterface>(GuarnicionPaths.delete, id);
  return response;
};


export const UpdateGuarnicion = async (id: number, data: any) => {
  const response = await put<GuarnicionInterface>(
    GuarnicionPaths.put + `/${id}`, data);

  return response;
};



