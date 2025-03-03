import { DottedButton } from 'Common/Buttons';
import { BasicInput, SelectComponent } from 'Common/Components';
import { motion } from 'framer-motion';
import React, { useState } from 'react';


interface FormCformUusariosProps {
    handleCreateUser: () => void;
    formik: any
    isEdit: boolean,

}

export const FormPedios: React.FC<FormCformUusariosProps> = ({
    formik,
    isEdit,
}) => {

    const formatFecha = (value: string) => {
        const cleanValue = value.replace(/\D/g, "");

        if (cleanValue.length <= 2) return cleanValue;
        if (cleanValue.length <= 4) return `${cleanValue.slice(0, 2)}/${cleanValue.slice(2)}`;
        return `${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 4)}/${cleanValue.slice(4, 6)}`;
    };

 


    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="w-full flex flex-col  gap-4">
                <div className="w-full   rounded-md">
                    <div className=" p-4">
                        <div className="flex gap-4 mb-4">
                            <div className="w-1/2">
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1, delay: 0.2 }}
                                >
                                    <BasicInput
                                        type="text"
                                        id="idUsuario"
                                        value={formik.values.idUsuario}
                                        onChange={formik.handleChange}
                                        placeholder="Nombre"
                                        label="Nombre del idUsuario"
                                        isError={!!(formik.touched.idUsuario && formik.errors.idUsuario)}
                                        errorMessage={formik.errors.idUsuario || ""}
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
                                        id="fechaPedido"
                                        value={formik.values.fechaPedido}
                                        onChange={(e) => {
                                            const formattedDate = formatFecha(e.target.value);
                                            formik.setFieldValue("fechaPedido", formattedDate);
                                        }}
                                        placeholder="DD/MM/AA"
                                        label="Fecha del Pedido"
                                        maxLength={8}
                                        isError={!!(formik.touched.fechaPedido && formik.errors.fechaPedido)}
                                        errorMessage={formik.errors.fechaPedido || ""}
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
                                        type="number"
                                        id="total"
                                        value={formik.values.total}
                                        onChange={formik.handleChange}
                                        placeholder="Ingrese el total"
                                        label="total"
                                        isError={!!(formik.touched.total && formik.errors.total)}
                                        errorMessage={formik.errors.total || ""}
                                        onBlur={formik.handleBlur}
                                    />
                                </motion.div>

                            </div>
                            <div className=" w-1/2">
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1, delay: 0.2 }}
                                >
                                    <SelectComponent
                                        id="estado"
                                        value={formik.values.estado
                                            ? { label: formik.values.estado, value: formik.values.estado }
                                            : undefined}
                                        onChange={(selectedOption) => formik.setFieldValue("estado", selectedOption?.value)}
                                        label="Estado"
                                        options={[
                                            { label: "Pendiente", value: "Pendiente" },
                                            { label: "En camino", value: "En camino" },
                                            { label: "Entregado", value: "Entregado" }
                                        ]}
                                        isError={!!(formik.touched.estado && formik.errors.estado)}
                                        errorMessage={formik.errors.estado || ""}
                                    />
                                </motion.div>



                            </div>
                        </div>

                    </div>

                    <div className="flex justify-center pt-4">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.2 }}
                        >
                            <DottedButton
                                type="submit"
                                text={isEdit ? "Editar Pedido" : "Crear Pedido"}
                            />
                        </motion.div>

                    </div>
                </div>
            </div>
        </form>
    );
};

