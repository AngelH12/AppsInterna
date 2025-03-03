import { DottedButton } from 'Common/Buttons';
import { BasicInput } from 'Common/Components';
import { motion } from 'framer-motion';
import React from 'react';


interface FormCformUusariosProps {
    handleCreateUser: () => void;
    formik: any
    isEdit: boolean,

}

export const FormCombos: React.FC<FormCformUusariosProps> = ({
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
                                        id="nombre"
                                        value={formik.values.nombre}
                                        onChange={formik.handleChange}
                                        placeholder="Nombre"
                                        label="Nombre del producto"
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
                                        id="descripcion"
                                        value={formik.values.descripcion}
                                        onChange={formik.handleChange}
                                        placeholder="Ingrese la descripcion"
                                        label="Descripcion"
                                        isError={!!(formik.touched.descripcion && formik.errors.descripcion)}
                                        errorMessage={formik.errors.descripcion || ""}
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
                                        id="precio"
                                        value={formik.values.precio}
                                        onChange={formik.handleChange}
                                        placeholder="Ingrese el precio"
                                        label="Precio"
                                        isError={!!(formik.touched.precio && formik.errors.precio)}
                                        errorMessage={formik.errors.precio || ""}
                                        onBlur={formik.handleBlur}
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
                                text={isEdit ? "Editar Combos" : "Crear Combos"}
                            />
                        </motion.div>

                    </div>
                </div>
            </div>
        </form>
    );
};


