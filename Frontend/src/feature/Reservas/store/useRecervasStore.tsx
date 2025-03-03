

import { GuarnicionInterface } from "interfaces/Guarnicion";
import { ProductoInterface } from "interfaces/Producto/Producto";
import { ReservaInterface } from "interfaces/Reserva/Reserva";
import { create } from "zustand";

interface ProductoState {
    entity: ReservaInterface | null;
    idToDelete: number | null;
    isEdit: boolean;

    setEntity: (entity: ReservaInterface | null) => void; 
    setIdToDelete: (idToDelete: number | null) => void;
    setIsEdit: (isEdit: boolean) => void;
}

export const useRecervasStore = create<ProductoState>((set) => ({
    entity: null,
    idToDelete: null,
    isEdit: false,

    setEntity: (entity) => set({ entity }),
    setIdToDelete: (idToDelete) => set({ idToDelete }),
    setIsEdit: (isEdit) => set({ isEdit }),
}));


