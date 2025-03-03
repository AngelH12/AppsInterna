import { DottedButton } from 'Common/Buttons';
import { BasicInput, SelectComponent } from 'Common/Components';
import { motion } from 'framer-motion';
import React, { useState } from 'react';


interface FormCformUusariosProps {
    handleCreateUser: () => void;
    formik: any
    isEdit: boolean,

}

export const FormUusarios: React.FC<FormCformUusariosProps> = ({
    formik,
    isEdit,
}) => {
    const [showPassword] = useState(false);

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
                                        placeholder="Nombre completo"
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
                                        id="correo"
                                        value={formik.values.correo}
                                        onChange={formik.handleChange}
                                        placeholder="Ingrese un Correo"
                                        label="Correo"
                                        isError={!!(formik.touched.correo && formik.errors.correo)}
                                        errorMessage={formik.errors.correo || ""}
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
                                        type={showPassword ? "text" : "password"}
                                        id="contraseña"
                                        value={formik.values.contraseña}
                                        onChange={formik.handleChange}
                                        placeholder="Ingrese una contraseña"
                                        label="Contraseña"
                                        isError={!!(formik.touched.contraseña && formik.errors.contraseña)}
                                        errorMessage={formik.errors.contraseña || ""}
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

                                    <SelectComponent
                                        id="rol"
                                        value={formik.values.rol
                                            ? { label: formik.values.rol, value: formik.values.rol }
                                            : undefined}
                                        onChange={(selectedOption) => formik.setFieldValue("rol", selectedOption?.value)}
                                        label="rol"
                                        options={[
                                            { label: "Admin ", value: "Admin" },
                                            { label: "Gerente ", value: "Gerente " },
                                            { label: "Cajero ", value: "Cajero" }
                                        ]}
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
                                text={isEdit ? "Editar Usuario" : "Crear Usuario"}
                            />
                        </motion.div>

                    </div>
                </div>
            </div>
        </form>
    );
};


