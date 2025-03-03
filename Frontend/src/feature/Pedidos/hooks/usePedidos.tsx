import { useQuery, useQueryClient } from '@tanstack/react-query';
import { NotificationType, showNotifications } from 'helpers/toas_notification';
import { Edit, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react'
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { Link } from 'react-router-dom';
import { CreateroPedido, DeletedPedido, PedidoService, UpdatePedido } from 'services/service.cruds/Pedidos/Pedidos';
import { usePedidosStore } from '../store';
import { PedidoInterface } from 'interfaces/Pedidos/Pedidos';

export const usePedidos = () => {
    const [userRows, setUserRows] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitLogin, setIsSubmitLogin] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showActiveUsers, setShowActiveUsers] = useState(true);
    const { setIsEdit, entity, isEdit, setIdToDelete, setEntity, idToDelete} = usePedidosStore();
    const queryClient = useQueryClient();
    const [isDulce, setIsDulce] = useState(false);

    useEffect(() => {
        if (entity) {
            formik.setValues({
                idUsuario: entity.idUsuario || 0,
                fechaPedido: entity.fechaPedido || "", 
                total: entity.total, 
                estado: entity.estado

            });
        }
    }, [entity]);

    const {
        data: pedidos,
    } = useQuery({
        queryKey: ["pedidos"],
        queryFn: PedidoService,
    });


    const initialValues = {
        idUsuario: entity?.idUsuario || "",
        fechaPedido: entity?.fechaPedido || "",
        total: entity?.total|| "",
        estado: entity?.estado || "",
    };

    const validationSchema = Yup.object({
        idUsuario: Yup.string().required("El campo esobligatoio"),
        fechaPedido: Yup.string().required("El campo esobligatoio"),
        total: Yup.string().required("El campo esobligatoio"),
        estado: Yup.string().required("El campo esobligatoio"),

    });

    const convertirFechaISO = (fecha: string) => {
        const partes = fecha.split("/");
        if (partes.length === 3) {
            const dia = partes[0];
            const mes = partes[1];
            const anio = `20${partes[2]}`;
            return `${anio}-${mes}-${dia}T00:00:00.000`;
        }
        return null;
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            setIsSubmitLogin(true);
            const fechaISO = convertirFechaISO(values.fechaPedido);

            const payload = {
                idUsuario: values.idUsuario,
                fechaPedido: fechaISO,
                total: values.total,
                estado: values.estado

            };

            if (isEdit) {
                if (entity) {
                    onUserUpdate(entity.idPedido || 0, payload);
                } else {
                    console.error('userStore is null');
                }
            } else {
                create(payload);
            }

        },
    });

    useEffect(() => {
        if (pedidos) {
            createRows(pedidos);
        }
    }, [pedidos]);

    const create = async (payload: any) => {
        try {


            const response = await CreateroPedido(payload)


            if (response.success === true) {
                setTimeout(() => {
                    setIsSubmitLogin(false);
                }, 2000);

                toast.success(response.message, {
                    position: "top-right",
                    autoClose: 2000,
                });

                queryClient.invalidateQueries({
                    queryKey: ["guarniciones"],
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

    const createRows = (guarnicion: any) => {
    
        if (!guarnicion || guarnicion.length === 0) {
            showNotifications(
                NotificationType.ERROR,
                "Ha ocurrido un error"
            );
            return;
        }

    
        const rows = guarnicion.map((guarnicion: PedidoInterface) => ({
            idUsuario: guarnicion.idUsuario,
            fechaPedido: guarnicion.fechaPedido,
            total: guarnicion.total,
            estado: guarnicion.estado,

            actions: (
                <div className="flex gap-2">
                    <button
                        onClick={() => onClickOpenForm(guarnicion)}
                        className="p-2 bg-slate-400 text-white rounded-md hover:bg-blue-600 transition"
                        title="Editar"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
    
                    <button
                        onClick={() => onclickDelete(guarnicion)}
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
    


    const onclickDelete = (user: PedidoInterface) => {
        setShowDeleteModal(true);
        setIdToDelete(user.idPedido || 0);
    };

    const onClickOpenForm = (user: PedidoInterface) => {
        setIsEdit(true);
        setEntity(user);
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
            accessorKey: 'idUsuario',
            header: 'Nombre',
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

            const responseDelete = await DeletedPedido(idToDelete);
            if (responseDelete.success === true) {

                showNotifications(
                    NotificationType.SUCCESS,
                    responseDelete.message
                );
                queryClient.invalidateQueries({
                    queryKey: ["guarniciones"],
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

            const responseDelete = await UpdatePedido(id, path);


            if (responseDelete.success === true) {
                setIdToDelete(null);

                queryClient.invalidateQueries({
                    queryKey: ["guarniciones"],
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
        setIsDulce,
        isDulce

    }
}


