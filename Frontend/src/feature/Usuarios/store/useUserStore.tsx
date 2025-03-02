import { UsuarioInterface } from "interfaces/user";
import { create } from "zustand";

interface UsuarioState {
    usuario: UsuarioInterface | null;
    idUsuarioEliminar: number | null;
    isEdit: boolean;

    setUsuario: (usuario: UsuarioInterface | null) => void;
    setIdUsuarioEliminar: (idUsuarioEliminar: number | null) => void;
    setIsEdit: (isEdit: boolean) => void;
}

export const useUsuarioStore = create<UsuarioState>((set) => ({
    usuario: null,
    idUsuarioEliminar: null,
    isEdit: false,

    setUsuario: (usuario) => set({ usuario }),
    setIdUsuarioEliminar: (idUsuarioEliminar) => set({ idUsuarioEliminar }),
    setIsEdit: (isEdit) => set({ isEdit }),
}));
