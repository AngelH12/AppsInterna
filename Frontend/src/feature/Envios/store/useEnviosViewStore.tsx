

import { EnvioInterface } from "interfaces/Pedidos/Pedidos";
import { create } from "zustand";

interface ProductoState {
    entity: EnvioInterface | null;
    idToDelete: number | null;
    isEdit: boolean;

    setEntity: (entity: EnvioInterface | null) => void; 
    setIdToDelete: (idToDelete: number | null) => void;
    setIsEdit: (isEdit: boolean) => void;
}

export const useEnviosViewStore = create<ProductoState>((set) => ({
    entity: null,
    idToDelete: null,
    isEdit: false,

    setEntity: (entity) => set({ entity }),
    setIdToDelete: (idToDelete) => set({ idToDelete }),
    setIsEdit: (isEdit) => set({ isEdit }),
}));

