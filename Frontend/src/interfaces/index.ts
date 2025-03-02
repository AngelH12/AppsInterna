
export interface Login {
    Correo: string;
    Contraseña: string;
}

export interface LoginResponse {
    message: string;
    token?: string;
    rol?: string;
}


export interface RefreshTokenResponse {
    user: {
      email: string;
      token: string;
    };
  }

