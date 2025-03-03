

import { ComboInterface } from "interfaces/Combos";
import { InventarioInterface } from "interfaces/Ingrediente/Ingrediente";
import { create } from "zustand";

interface ProductoState {
    entity: InventarioInterface | null;
    idToDelete: number | null;
    isEdit: boolean;

    setEntity: (entity: InventarioInterface | null) => void; 
    setIdToDelete: (idToDelete: number | null) => void;
    setIsEdit: (isEdit: boolean) => void;
}

export const useInventarioStore = create<ProductoState>((set) => ({
    entity: null,
    idToDelete: null,
    isEdit: false,

    setEntity: (entity) => set({ entity }),
    setIdToDelete: (idToDelete) => set({ idToDelete }),
    setIsEdit: (isEdit) => set({ isEdit }),
}));



