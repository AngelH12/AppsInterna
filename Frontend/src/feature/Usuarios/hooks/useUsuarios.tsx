import { useQuery, useQueryClient } from '@tanstack/react-query';
import { NotificationType, showNotifications } from 'helpers/toas_notification';
import { Edit, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react'
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { Link } from 'react-router-dom';
import { useUsuarioStore } from '../store';
import { UsuarioInterface } from 'interfaces/user';
import { CreaterUser, DeletedUser, UpdateUser, UserService } from 'services/service.cruds/Usuarios';

export const useUsuarios = () => {
    const [userRows, setUserRows] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitLogin, setIsSubmitLogin] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showActiveUsers, setShowActiveUsers] = useState(true);
    const { setIsEdit, usuario, isEdit, setUsuario, idUsuarioEliminar, setIdUsuarioEliminar} = useUsuarioStore();
    const queryClient = useQueryClient();


    useEffect(() => {
        if (usuario) {
            formik.setValues({
                idUsuario: usuario.idUsuario || "", 
                nombre: usuario.nombre || "",
                correo: usuario.correo || "",
                contraseña: usuario.contraseña || "", 
                rol: usuario.rol || "", 
            });
        }
    }, [usuario]);
    


    const {
        data: user,
    } = useQuery({
        queryKey: ["user"],
        queryFn: UserService,
    });


    const initialValues = {
        nombre: usuario?.nombre || "",
        idUsuario: usuario?.idUsuario || "",
        contraseña: usuario?.contraseña || "",
        correo: usuario?.correo || "",
        rol: usuario?.rol || ""
    };

    const validationSchema = Yup.object({
        nombre: Yup.string().required("El nombre es obligatorio"),
        rol: Yup.string().required("El rol es obligatorio"),
        correo: Yup.string()
        .email("Debe ser un correo válido")
        .required("El correo es obligatorio"), 
         contraseña: Yup.string().required("La contraseña es obligatorio"),
    });

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            setIsSubmitLogin(true);

            const payload = {
                nombre: values.nombre,
                correo: values.correo,
                contraseña: values.contraseña,
                rol: values.rol
            };

            if (isEdit) {
                if (usuario) {
                    onUserUpdate(usuario.idUsuario || 0, payload);
                } else {
                    console.error('userStore is null');
                }
            } else {
                create(payload);
            }

        },
    });

    useEffect(() => {
        if (user) {
            createRows(user);
        }
    }, [user]);

    const create = async (payload: any) => {
        try {

            const response = await CreaterUser(payload)

            console.log("response", response)

            if (response.message === "Usuario creado exitosamente.") {
                setTimeout(() => {
                    setIsSubmitLogin(false);
                }, 2000);

                toast.success(response.message, {
                    position: "top-right",
                    autoClose: 2000,
                });

                queryClient.invalidateQueries({
                    queryKey: ["user"],
                });

            } else {
                setTimeout(() => {
                    setIsSubmitLogin(false);
                }, 2000);

                toast.error(response.message, {
                    position: "top-right",
                    autoClose: 2000,
                });
            }

        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message, {
                    position: "top-right",
                    autoClose: 2000,
                });
            }
        } finally {
            setIsSubmitLogin(false);
        }
    }

    const createRows = (users: any) => {
        console.log("users", users);
    
        if (!users || users.length === 0) {
            showNotifications(
                NotificationType.ERROR,
                "Ha ocurrido un error"
            );
            return;
        }
    
        const rows = users.map((user: UsuarioInterface) => ({
            nombre: user.nombre,
            correo: user.correo,
            rol: user.rol,
            actions: (
                <div className="flex gap-2">
                    <button
                        onClick={() => onClickOpenForm(user)}
                        className="p-2 bg-slate-400 text-white rounded-md hover:bg-blue-600 transition"
                        title="Editar"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
    
                    <button
                        onClick={() => onclickDelete(user)}
                        className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                        title="Eliminar"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ),
        }));
    
        setUserRows(rows);
    };
    


    const onclickDelete = (user: UsuarioInterface) => {
        setShowDeleteModal(true);
        setIdUsuarioEliminar(user.idUsuario || 0);
    };

    const onClickOpenForm = (user: UsuarioInterface) => {
        setIsEdit(true);
        setUsuario(user);
    };

    const columns = [
        {
            header: "ID",
            accessorKey: "id",
            enableColumnFilter: false,
            enableSorting: true,
            cell: (cell: any) => (
                <Link
                    to="#!"
                    className="transition-all duration-150 ease-linear text-black hover:text-black user-id"
                >
                    {cell.row.index + 1}
                </Link>
            ),
        },
        {
            accessorKey: 'nombre',
            header: 'Nombre',
        },
        {
            accessorKey: 'correo',
            header: 'Correo',
        },
        {
            accessorKey: 'rol',
            header: 'Rol',
        },

        {
            accessorKey: 'actions',
            header: 'Acciones',
            enableColumnFilter: false,
            enableSorting: true,
            cell: ({ getValue }: { getValue: () => any }) => getValue(),
        },


    ];



    const handleCreateUser = () => {
        setShowModal(true);
    };

    const onHideModal = () => {
        if (showDeleteModal) {
            setShowDeleteModal(false);
        }
    };

    const onDeleteConfirm = async () => {
        try {

            if (!idUsuarioEliminar) return;

            const responseDelete = await DeletedUser(idUsuarioEliminar);
            if (responseDelete.success === true) {

                showNotifications(
                    NotificationType.SUCCESS,
                    responseDelete.message
                );
                queryClient.invalidateQueries({
                    queryKey: ["user"],
                });
                onHideModal()

            } else {
                showNotifications(
                    NotificationType.ERROR,
                    responseDelete.message
                );
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message, {
                    position: "top-right",
                    autoClose: 2000,
                });
            }
        } finally {
            setTimeout(() => {
                setIsSubmitLogin(false);
            }, 2000);
        }

    };


    const onUserUpdate = async (id: number, path: any) => {
        try {
            if (!id) return;

            const responseDelete = await UpdateUser(id, path);


            if (responseDelete.success === true) {
                setIdUsuarioEliminar(null);

                queryClient.invalidateQueries({
                    queryKey: ["user"],
                });

                showNotifications(
                    NotificationType.SUCCESS,
                    responseDelete.message
                );

                setShowDeleteModal(false);
            } else {
                showNotifications(
                    NotificationType.ERROR,
                    responseDelete.message
                );
            }
        } catch (error) {
            showNotifications(NotificationType.ERROR, "Error"
            );
        }
        finally {
            setTimeout(() => {
                setIsSubmitLogin(false);
            }, 2000);
        }
    };


    return {
        columns,
        userRows,
        handleCreateUser,
        setShowModal,
        showModal,
        formik,
        isSubmitLogin,
        showDeleteModal,
        onHideModal,
        onDeleteConfirm,
        setShowActiveUsers,
        showActiveUsers,
        isEdit,

    }
}





