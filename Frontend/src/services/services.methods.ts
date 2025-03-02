import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useSessionStore } from "Common/Stores";
import { GenericApiResponse } from "./ApiResponse";
import { PUBLIC_URL } from "helpers/enviroment";

export const api = axios.create({
  baseURL: PUBLIC_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;


api.interceptors.request.use(
  async (config) => {
    const session = useSessionStore.getState().session?.token;

    if (!session) {
      console.warn("No session or access_token found");
      return config;
    }

    const token = session;
    const decodedToken = jwtDecode<any>(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp && decodedToken.exp < currentTime && !isRefreshing) {
      try {
        isRefreshing = true;
      } catch (error) {
        isRefreshing = false;
        throw error;
      }
    }

    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.request.use(
  async (config) => {
    const session = useSessionStore.getState().session?.token;

    if (!session) {
      console.warn("No session or access_token found");
      return config;
    }

    const token = session;
    const decodedToken = jwtDecode<any>(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp && decodedToken.exp < currentTime && !isRefreshing) {
      try {
        isRefreshing = true;
      } catch (error) {
        isRefreshing = false;
        throw error;
      }
    }

    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);


export const get = async <T>(url: string): Promise<GenericApiResponse<T>> => {

  try {
    const response = await api.get<GenericApiResponse<T>>(url);


    if (response && response.data) {
      return response.data;
    }

    throw new Error("Invalid response format: Missing 'data' in response");
  } catch (error: any) {
    console.error("Error during API request:", {
      message: error.message,
      response: error.response,
      stack: error.stack,
    });

    if (error.response && error.response.status === 400) {
      throw new Error(`Error 400: ${error.response.data.message || 'Bad Request'}`);
    }

    throw new Error(
      error.response?.data?.message || error.message || "Unknown error occurred while fetching data"
    );
  }
};


// Función para enviar datos (POST)
export const post = async <T>(url: string, data: any): Promise<GenericApiResponse<T>> => {
  try {
    const response = await api.post(url, data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      throw new Error(`Error 400: ${error.response.data.message || 'Bad Request'}`);
    }

    throw error;
  }
};

// Función para actualizar datos (PATCH)
export const patch = async <T>(url: string, data: any): Promise<GenericApiResponse<T>> => {
  try {
    const response = await api.patch(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para reemplazar datos (PUT)
export const put = async <T>(url: string, data: any): Promise<GenericApiResponse<T>> => {
  try {
    const response = await api.put(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para eliminar datos (DELETE)
export const remove = async <T>(url: string): Promise<GenericApiResponse<T>> => {
  try {
    const response = await api.delete(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para eliminar por ID (DELETE por ID)
export const deleteById = async <T>(url: string, id: any): Promise<GenericApiResponse<T>> => {
  try {
    const fullUrl = `${url}/${id}`;
    const response = await api.delete(fullUrl);
    return response.data;
  } catch (error) {
    throw error;
  }
};
