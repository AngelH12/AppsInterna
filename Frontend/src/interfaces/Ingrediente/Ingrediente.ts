export interface InventarioInterface {
    idInventario: number;
    idIngrediente: number;
    ingrediente: IngredienteInterface;
    cantidad: number;
    tipoMovimiento: string;
    fechaMovimiento: string; 
    detalle: string;
}

export interface IngredienteInterface {
    idIngrediente: number;
    nombre: string;
    stock: number;
    unidadMedida: string;
    tipo: string;
    precioUnitario: number;
    activo: boolean;
}

