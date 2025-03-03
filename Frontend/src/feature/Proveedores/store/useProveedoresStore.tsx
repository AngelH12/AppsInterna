

import { ProveedorInterface } from "interfaces/Proveedor/Proveedor";
import { create } from "zustand";

interface ProductoState {
    entity: ProveedorInterface | null;
    idToDelete: number | null;
    isEdit: boolean;

    setEntity: (entity: ProveedorInterface | null) => void; 
    setIdToDelete: (idToDelete: number | null) => void;
    setIsEdit: (isEdit: boolean) => void;
}

export const useProveedoresStore = create<ProductoState>((set) => ({
    entity: null,
    idToDelete: null,
    isEdit: false,

    setEntity: (entity) => set({ entity }),
    setIdToDelete: (idToDelete) => set({ idToDelete }),
    setIsEdit: (isEdit) => set({ isEdit }),
}));

