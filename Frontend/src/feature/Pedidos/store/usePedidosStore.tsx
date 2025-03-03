

import { EnvioInterface, PedidoInterface } from "interfaces/Pedidos/Pedidos";
import { create } from "zustand";

interface ProductoState {
    entity: PedidoInterface | null;
    idToDelete: number | null;
    isEdit: boolean;

    setEntity: (entity: PedidoInterface | null) => void; 
    setIdToDelete: (idToDelete: number | null) => void;
    setIsEdit: (isEdit: boolean) => void;
}

export const usePedidosStore = create<ProductoState>((set) => ({
    entity: null,
    idToDelete: null,
    isEdit: false,

    setEntity: (entity) => set({ entity }),
    setIdToDelete: (idToDelete) => set({ idToDelete }),
    setIsEdit: (isEdit) => set({ isEdit }),
}));



