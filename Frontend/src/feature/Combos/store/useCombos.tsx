

import { ComboInterface } from "interfaces/Combos";
import { create } from "zustand";

interface ProductoState {
    entity: ComboInterface | null;
    idToDelete: number | null;
    isEdit: boolean;

    setEntity: (entity: ComboInterface | null) => void; 
    setIdToDelete: (idToDelete: number | null) => void;
    setIsEdit: (isEdit: boolean) => void;
}

export const useCombosStore = create<ProductoState>((set) => ({
    entity: null,
    idToDelete: null,
    isEdit: false,

    setEntity: (entity) => set({ entity }),
    setIdToDelete: (idToDelete) => set({ idToDelete }),
    setIsEdit: (isEdit) => set({ isEdit }),
}));

