import { useQuery, useQueryClient } from '@tanstack/react-query';
import { NotificationType, showNotifications } from 'helpers/toas_notification';
import { Edit, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react'
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { Link } from 'react-router-dom';
import { CreaterEnvio, DeletedEnvio, EnvioService, UpdateGEnvio } from 'services/service.cruds/Envios';
import { EnvioInterface } from 'interfaces/Pedidos/Pedidos';
import { useEnviosViewStore } from '../store';

export const useEnviosView = () => {
    const [userRows, setUserRows] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitLogin, setIsSubmitLogin] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showActiveUsers, setShowActiveUsers] = useState(true);
    const { setIsEdit, entity, isEdit, setIdToDelete, setEntity, idToDelete } = useEnviosViewStore();
    const queryClient = useQueryClient();
    const [isDulce, setIsDulce] = useState(false);

    useEffect(() => {
        if (entity) {
            formik.setValues({
                idPedido: entity.idEnvio || "",
                direccion: entity.direccion || "",
                telefono: entity.telefono.toString() || "",
                estado: entity.estado
            });
        }
    }, [entity]);



    const {
        data: envios,
    } = useQuery({
        queryKey: ["envios"],
        queryFn: EnvioService,
    });


    const initialValues = {
        idPedido: entity?.idPedido || "",
        direccion: entity?.direccion || "",
        telefono: entity?.telefono || "",
        estado: entity?.estado || "",

    };

    const validationSchema = Yup.object({
        idPedido: Yup.string().required("El nombre es obligatorio"),
        direccion: Yup.string().required("El campo esobligatoio"),
        telefono: Yup.string().required("El campo esobligatoio"),
        estado: Yup.string().required("El campo esobligatoio"),

    });

    const formik = useFormik({
        initialValues,
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            setIsSubmitLogin(true);

            const payload = {
                idPedido: values.idPedido,
                direccion: values.direccion,
                telefono: values.telefono,
                estado: values.estado

            };

            if (isEdit) {
                if (entity) {
                    onUserUpdate(entity.idEnvio || 0, payload);
                } else {
                    console.error('userStore is null');
                }
            } else {
                create(payload);
            }

        },
    });

    useEffect(() => {
        if (envios) {
            createRows(envios);
        }
    }, [envios]);

    const create = async (payload: any) => {
        try {


            const response = await CreaterEnvio(payload)


            if (response.success === true) {
                setTimeout(() => {
                    setIsSubmitLogin(false);
                }, 2000);

                toast.success(response.message, {
                    position: "top-right",
                    autoClose: 2000,
                });

                queryClient.invalidateQueries({
                    queryKey: ["envios"],
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

    const createRows = (envio: any) => {

        if (!envio || envio.length === 0) {
            showNotifications(
                NotificationType.ERROR,
                "Ha ocurrido un error"
            );
            return;
        }


        const rows = envio.map((envio: EnvioInterface) => ({
            direccion: envio.direccion,
            telefono: envio.telefono,
            total: envio.pedido.total,
            estado: envio.estado,

            actions: (
                <div className="flex gap-2">
                    <button
                        onClick={() => onClickOpenForm(envio)}
                        className="p-2 bg-slate-400 text-white rounded-md hover:bg-blue-600 transition"
                        title="Editar"
                    >
                        <Edit className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => onclickDelete(envio)}
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



    const onclickDelete = (envio: EnvioInterface) => {
        setShowDeleteModal(true);
        setIdToDelete(envio.idEnvio || 0);
    };

    const onClickOpenForm = (envio: EnvioInterface) => {
        setIsEdit(true);
        setEntity(envio);
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
            accessorKey: 'direccion',
            header: 'Direccion',
        },

        {
            accessorKey: 'telefono',
            header: 'Telefono',
        },

        {
            accessorKey: 'total',
            header: 'Total',
        },
        {
            accessorKey: 'estado',
            header: 'Estado',
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

            if (!idToDelete) return;

            const responseDelete = await DeletedEnvio(idToDelete);
            if (responseDelete.success === true) {

                showNotifications(
                    NotificationType.SUCCESS,
                    responseDelete.message
                );
                queryClient.invalidateQueries({
                    queryKey: ["envios"],
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

            const responseDelete = await UpdateGEnvio(id, path);


            if (responseDelete.success === true) {
                setIdToDelete(null);

                queryClient.invalidateQueries({
                    queryKey: ["envios"],
                });

                showNotifications(
                    NotificationType.SUCCESS,
                    responseDelete.message
                );

                setShowDeleteModal(false);
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
        setIsDulce,
        isDulce

    }
}

