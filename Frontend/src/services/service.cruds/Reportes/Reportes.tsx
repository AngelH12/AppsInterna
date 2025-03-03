import { ReporteInterface } from "interfaces/ReporteInterface";
import { deleteById, get, patch, post, put, remove } from "services/services.methods";
import { ReportePaths } from "services/services.paths";

export const ReportesService = async () => {
  const response = await get<ReporteInterface>(ReportePaths.get);

  return response;
};

