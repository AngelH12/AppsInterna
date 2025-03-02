import CryptoJS from "crypto-js";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { KEY_SECRET } from "helpers/enviroment";
import { LoginResponse } from "interfaces";

interface SessionStore {
  session: LoginResponse | null;
  isAuthtenticated: boolean;
  setIsAuthtenticated: (isAuthtenticated: boolean) => void;
  setSession: (session: LoginResponse | null) => void;
  clearSession: () => void;
}

//Encript the session previus to save it in the local storage
const encrypt = (data: any, key: string) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
};

// Decript the session previus to save it in the local storage
const decrypt = (encryptedData: string, key: string) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, key);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedData);
};

export const useSessionStore = create(
  persist<SessionStore>(
    (set, get) => ({
      session: null,
      isAuthtenticated: false,
      setIsAuthtenticated: (isAuthtenticated) => set({ isAuthtenticated }),
      setSession: (session) => set({ session }),
      clearSession: () => set({ session: null }),
    }),
    {
      name: "session-storage",
      storage: {
        getItem: (name: string) => {
          const data = localStorage.getItem(name);
          return data ? decrypt(data, KEY_SECRET) : null;
        },
        setItem: (name: string, data: any) => {
          const encriptedData = encrypt(data, KEY_SECRET);
          localStorage.setItem(name, encriptedData);
        },
        removeItem: (name: string) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);
