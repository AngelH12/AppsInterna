interface Sucursal {
    idSucursal: number;
    nombre: string;
    direccion: string;
    telefono: string | null;
    activo: boolean;
  }
  
 export interface ReporteInterface {
    idReporte: number;
    idSucursal: number;
    fecha: string; 
    totalVentas: number;
    productosVendidos: number;
    sucursal: Sucursal;
  }
  