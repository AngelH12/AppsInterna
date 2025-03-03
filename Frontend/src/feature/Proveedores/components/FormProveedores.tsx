import { DottedButton } from 'Common/Buttons';
import { BasicInput, SelectComponent } from 'Common/Components';
import { motion } from 'framer-motion';
import React from 'react';

interface FormProveedoresProps {
    handleCreateUser: () => void;
    formik: any;
    isEdit: boolean;
}

export const FormProveedores: React.FC<FormProveedoresProps> = ({
    formik,
    isEdit,
}) => {
    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="w-full flex flex-col gap-4">
                <div className="w-full rounded-md p-4">
                    <div className="flex gap-4 mb-4">
                        <div className="w-1/2">
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.2 }}
                            >
                                <BasicInput
                                    type="text"
                                    id="nombre"
                                    value={formik.values.nombre}
                                    onChange={formik.handleChange}
                                    placeholder="Nombre del proveedor"
                                    label="Nombre"
                                    isError={!!(formik.touched.nombre && formik.errors.nombre)}
                                    errorMessage={formik.errors.nombre || ""}
                                    onBlur={formik.handleBlur}
                                />
                            </motion.div>
                        </div>
                        <div className="w-1/2">
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.2 }}
                            >
                                <BasicInput
                                    type="text"
                                    id="telefono"
                                    value={formik.values.telefono}
                                    onChange={formik.handleChange}
                                    placeholder="Ingrese el teléfono"
                                    label="Teléfono"
                                    isError={!!(formik.touched.telefono && formik.errors.telefono)}
                                    errorMessage={formik.errors.telefono || ""}
                                    onBlur={formik.handleBlur}
                                />
                            </motion.div>
                        </div>
                    </div>
                    <div className="flex gap-4 mb-4">
                        <div className="w-1/2">
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.2 }}
                            >
                                <BasicInput
                                    type="text"
                                    id="direccion"
                                    value={formik.values.direccion}
                                    onChange={formik.handleChange}
                                    placeholder="Ingrese la dirección"
                                    label="Dirección"
                                    isError={!!(formik.touched.direccion && formik.errors.direccion)}
                                    errorMessage={formik.errors.direccion || ""}
                                    onBlur={formik.handleBlur}
                                />
                            </motion.div>
                        </div>
                        <div className="w-1/2">
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.2 }}
                            >
                                <BasicInput
                                    type="text"
                                    id="correo"
                                    value={formik.values.correo}
                                    onChange={formik.handleChange}
                                    placeholder="Ingrese el correo electrónico"
                                    label="Correo Electrónico"
                                    isError={!!(formik.touched.correo && formik.errors.correo)}
                                    errorMessage={formik.errors.correo || ""}
                                    onBlur={formik.handleBlur}
                                />
                            </motion.div>
                        </div>
                    </div>
                    <div className="w-full mb-4">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.2 }}
                        >
                            <BasicInput
                                type="text"
                                id="tipoProducto"
                                value={formik.values.tipoProducto}
                                onChange={formik.handleChange}
                                placeholder="Ingrese el tipo de producto"
                                label="Tipo de Producto"
                                isError={!!(formik.touched.tipoProducto && formik.errors.tipoProducto)}
                                errorMessage={formik.errors.tipoProducto || ""}
                                onBlur={formik.handleBlur}
                            />
                        </motion.div>
                    </div>
                    <div className="flex justify-center pt-4">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.2 }}
                        >
                            <DottedButton
                                type="submit"
                                text={isEdit ? "Editar Proveedor" : "Crear Proveedor"}
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
        </form>
    );
};
