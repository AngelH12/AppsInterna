import { DottedButton } from 'Common/Buttons';
import { BasicInput, SelectComponent } from 'Common/Components';
import { motion } from 'framer-motion';
import React from 'react';


interface FormCformUusariosProps {
    handleCreateUser: () => void;
    formik: any
    isEdit: boolean,

}

export const FormEnvios: React.FC<FormCformUusariosProps> = ({
    formik,
    isEdit,
}) => {

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="w-full flex flex-col gap-4">
                <div className="w-full rounded-md p-4">
                    <div className="flex gap-4 mb-4">
                        <div className="w-1/2">
                            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}>
                                <BasicInput
                                    type="number"
                                    id="idPedido"
                                    value={formik.values.idPedido}
                                    onChange={formik.handleChange}
                                    placeholder="Ingrese el ID del pedido"
                                    label="ID del Pedido"
                                    isError={!!(formik.touched.idPedido && formik.errors.idPedido)}
                                    errorMessage={formik.errors.idPedido || ""}
                                    onBlur={formik.handleBlur}
                                />
                            </motion.div>
                        </div>

                        <div className="w-1/2">
                            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}>
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
                                />



                            </motion.div>
                        </div>
                    </div>



                    <div className="flex gap-4 mb-4">
                        <div className="w-1/2">
                            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}>
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
                            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}>
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

                    <div className="flex justify-center pt-4">
                        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}>
                            <DottedButton type="submit" text={isEdit ? "Editar Envío" : "Crear Envío"} />
                        </motion.div>
                    </div>
                </div>
            </div>
        </form>
    );
};

