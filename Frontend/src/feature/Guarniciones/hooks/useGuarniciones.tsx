import { useQuery, useQueryClient } from '@tanstack/react-query';
import { NotificationType, showNotifications } from 'helpers/toas_notification';
import { Edit, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react'
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { Link } from 'react-router-dom';
import { CreaterPGuarnicion, DeletedGuarnicion, PGuarnicionService, UpdateGuarnicion } from 'services/service.cruds/Guarnicion';
import { GuarnicionInterface } from 'interfaces/Guarnicion';
import { useuseGuarnicionesStore } from '../store';

export const useGuarniciones = () => {
    const [userRows, setUserRows] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitLogin, setIsSubmitLogin] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showActiveUsers, setShowActiveUsers] = useState(true);
    const { setIsEdit, entity, isEdit, setIdToDelete, setEntity, idToDelete} = useuseGuarnicionesStore();
    const queryClient = useQueryClient();
    const [isDulce, setIsDulce] = useState(false);

    useEffect(() => {
        if (entity) {
            formik.setValues({
                nombre: entity.nombre || "",
                precio: entity.precio.toString() || "", 
                stock: entity.stock, 

            });
        }
    }, [entity]);



    const {
        data: guarniciones,
    } = useQuery({
        queryKey: ["guarniciones"],
        queryFn: PGuarnicionService,
    });


    const initialValues = {
        nombre: entity?.nombre || "",
        precio: entity?.precio || "",
        stock: entity?.stock || "",
    };

    const validationSchema = Yup.object({
        nombre: Yup.string().required("El nombre es obligatorio"),
        precio: Yup.string().required("El campo esobligatoio"),
        stock: Yup.string().required("El campo esobligatoio"),
    });

    const formik = useFormik({
        initialValues,
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            setIsSubmitLogin(true);

            const payload = {
                nombre: values.nombre,
                precio: values.precio,
                stock: values.stock,
                activo: true

            };

            if (isEdit) {
                if (entity) {
                    onUserUpdate(entity.idGuarnicion || 0, payload);
                } else {
                    console.error('userStore is null');
                }
            } else {
                create(payload);
            }

        },
    });

    useEffect(() => {
        if (guarniciones) {
            createRows(guarniciones);
        }
    }, [guarniciones]);

    const create = async (payload: any) => {
        try {


            const response = await CreaterPGuarnicion(payload)


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

    
        const rows = guarnicion.map((guarnicion: GuarnicionInterface) => ({
            nombre: guarnicion.nombre,
            precio: guarnicion.precio,
            stock: guarnicion.stock,

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
    


    const onclickDelete = (user: GuarnicionInterface) => {
        setShowDeleteModal(true);
        setIdToDelete(user.idGuarnicion || 0);
    };

    const onClickOpenForm = (user: GuarnicionInterface) => {
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
            accessorKey: 'nombre',
            header: 'Nombre',
        },
 
        {
            accessorKey: 'precio',
            header: 'Precio',
        },

        {
            accessorKey: 'stock',
            header: 'Stock',
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

            const responseDelete = await DeletedGuarnicion(idToDelete);
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

            const responseDelete = await UpdateGuarnicion(id, path);


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


