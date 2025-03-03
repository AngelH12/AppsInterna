import { DottedButton } from 'Common/Buttons';
import { BasicInput, SelectComponent } from 'Common/Components';
import { motion } from 'framer-motion';
import React from 'react';


interface FormCformUusariosProps {
    handleCreateUser: () => void;
    formik: any
    isEdit: boolean,

}

export const FormInventario: React.FC<FormCformUusariosProps> = ({
    formik,
    isEdit,
}) => {

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
                                        id="idIngrediente"
                                        value={formik.values.idIngrediente}
                                        onChange={formik.handleChange}
                                        placeholder="ingrediente"
                                        label="Nombre del ingrediente"
                                        isError={!!(formik.touched.idIngrediente && formik.errors.idIngrediente)}
                                        errorMessage={formik.errors.idIngrediente || ""}
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
                                        id="cantidad"
                                        value={formik.values.cantidad}
                                        onChange={formik.handleChange}
                                        placeholder="Ingrese la cantidad"
                                        label="Cantidad"
                                        isError={!!(formik.touched.cantidad && formik.errors.cantidad)}
                                        errorMessage={formik.errors.cantidad || ""}
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
                                    <SelectComponent
                                        id="tipoMovimiento"
                                        value={formik.values.tipoMovimiento
                                            ? { label: formik.values.tipoMovimiento, value: formik.values.tipoMovimiento }
                                            : undefined}
                                        onChange={(selectedOption) => formik.setFieldValue("tipoMovimiento", selectedOption?.value)}
                                        label="tipoMovimiento"
                                        options={[
                                            { label: "Ingreso", value: "Ingreso" },
                                            { label: "Salida", value: "Salida" },
                                        ]}
                                    />

                                </motion.div>

                            </div>
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.2 }}
                            >

                                <BasicInput
                                    type="number"
                                    id="detalle"
                                    value={formik.values.tipoMovimiento}
                                    onChange={formik.handleChange}
                                    placeholder="Ingrese el detalle"
                                    label="detalle"
                                    isError={!!(formik.touched.detalle && formik.errors.detalle)}
                                    errorMessage={formik.errors.detalle || ""}
                                    onBlur={formik.handleBlur}
                                />
                            </motion.div>

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
                                text={isEdit ? "Editar " : "Crear Inventario"}
                            />
                        </motion.div>

                    </div>
                </div>
            </div>
        </form>
    );
};

