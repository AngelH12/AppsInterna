import { useQuery, useQueryClient } from '@tanstack/react-query';
import { NotificationType, showNotifications } from 'helpers/toas_notification';
import { Edit, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react'
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { Link } from 'react-router-dom';
import { CreateroReservas, DeletedReservas, Reservaservice, UpdateReservas } from 'services/service.cruds/Reservas/Reservas';
import { ReservaInterface } from 'interfaces/Reserva/Reserva';
import {useRecervasStore} from "../../Reservas/store/useRecervasStore"
export const useReservas = () => {
    const [userRows, setUserRows] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitLogin, setIsSubmitLogin] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showActiveUsers, setShowActiveUsers] = useState(true);
    const { setIsEdit, entity, isEdit, setIdToDelete, setEntity, idToDelete} = useRecervasStore();
    const queryClient = useQueryClient();
    const [isDulce, setIsDulce] = useState(false);

    useEffect(() => {
        if (entity) {
            formik.setValues({
                nombreCliente: entity.nombreCliente || "",
                fecha: entity.fecha || "", 
                cantidadPersonas: entity.cantidadPersonas, 
                estado: entity.estado, 

            });
        }
    }, [entity]);



    const {
        data: reservaservice,
    } = useQuery({
        queryKey: ["reserva"],
        queryFn: Reservaservice,
    });


    const initialValues = {
        nombreCliente: entity?.nombreCliente || "",
        fecha: entity?.fecha || "",
        cantidadPersonas: entity?.cantidadPersonas || "",
        estado: entity?.estado || "",

    };

    const validationSchema = Yup.object({
        nombreCliente: Yup.string().required("El campo esobligatoio"),
        fecha: Yup.string().required("El campo esobligatoio"),
        cantidadPersonas: Yup.string().required("El campo esobligatoio"),
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
            const fechaISO = convertirFechaISO(values.fecha);

            const payload = {
                nombreCliente: values.nombreCliente,
                fecha: fechaISO,
                cantidadPersonas: values.cantidadPersonas,
                estado: values.estado

            };

            if (isEdit) {
                if (entity) {
                    onUserUpdate(entity.idReserva || 0, payload);
                } else {
                    console.error('userStore is null');
                }
            } else {
                create(payload);
            }

        },
    });

    useEffect(() => {
        if (reservaservice) {
            createRows(reservaservice);
        }
    }, [reservaservice]);

    const create = async (payload: any) => {
        try {


            const response = await CreateroReservas(payload)


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

    
        const rows = guarnicion.map((guarnicion: ReservaInterface) => ({
            nombreCliente: guarnicion.nombreCliente,
            cantidadPersonas: guarnicion.cantidadPersonas,
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
    


    const onclickDelete = (user: ReservaInterface) => {
        setShowDeleteModal(true);
        setIdToDelete(user.idReserva || 0);
    };

    const onClickOpenForm = (user: ReservaInterface) => {
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
            accessorKey: 'nombreCliente',
            header: 'Nombre',
        },
 
        {
            accessorKey: 'cantidadPersonas',
            header: 'Cantidad Personas',
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

            const responseDelete = await DeletedReservas(idToDelete);
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

            const responseDelete = await UpdateReservas(id, path);


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
