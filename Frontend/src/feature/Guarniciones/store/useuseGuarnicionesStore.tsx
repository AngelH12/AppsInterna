

import { GuarnicionInterface } from "interfaces/Guarnicion";
import { ProductoInterface } from "interfaces/Producto/Producto";
import { create } from "zustand";

interface ProductoState {
    entity: GuarnicionInterface | null;
    idToDelete: number | null;
    isEdit: boolean;

    setEntity: (entity: GuarnicionInterface | null) => void; 
    setIdToDelete: (idToDelete: number | null) => void;
    setIsEdit: (isEdit: boolean) => void;
}

export const useuseGuarnicionesStore = create<ProductoState>((set) => ({
    entity: null,
    idToDelete: null,
    isEdit: false,

    setEntity: (entity) => set({ entity }),
    setIdToDelete: (idToDelete) => set({ idToDelete }),
    setIsEdit: (isEdit) => set({ isEdit }),
}));


