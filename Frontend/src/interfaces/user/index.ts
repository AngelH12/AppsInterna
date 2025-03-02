export interface UsuarioInterface {
    idUsuario?: number;
    nombre: string;
    correo: string;
    contraseña: string;
    rol: "Admin" | "User" | "OtroRol"; 
  }
  