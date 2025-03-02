

import { ProductoInterface } from "interfaces/Producto/Producto";
import { create } from "zustand";

interface ProductoState {
    entity: ProductoInterface | null;
    idToDelete: number | null;
    isEdit: boolean;

    setEntity: (entity: ProductoInterface | null) => void; 
    setIdToDelete: (idToDelete: number | null) => void;
    setIsEdit: (isEdit: boolean) => void;
}

export const useProductosStore = create<ProductoState>((set) => ({
    entity: null,
    idToDelete: null,
    isEdit: false,

    setEntity: (entity) => set({ entity }),
    setIdToDelete: (idToDelete) => set({ idToDelete }),
    setIsEdit: (isEdit) => set({ isEdit }),
}));
