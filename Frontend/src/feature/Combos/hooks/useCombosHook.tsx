import { useQuery, useQueryClient } from '@tanstack/react-query';
import { NotificationType, showNotifications } from 'helpers/toas_notification';
import { Edit, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react'
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { Link } from 'react-router-dom';
import { CreaterProductos, DeletedProductos, ProductosService, UpdateProductos } from 'services/service.cruds/Productos';
import { ProductoInterface } from 'interfaces/Producto/Producto';
import { useProductosStore } from 'feature/GestióndeProductos/store';
import { CombosService, CreaterCombos, DeletedCombos, UpdateCombos } from 'services/service.cruds/Combos';
import { GuarnicionInterface } from 'interfaces/Guarnicion';
import { ComboInterface } from 'interfaces/Combos';
import { useCombosStore } from '../store';

export const useCombosHook = () => {
    const [userRows, setUserRows] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitLogin, setIsSubmitLogin] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showActiveUsers, setShowActiveUsers] = useState(true);
    const { setIsEdit, entity, isEdit, setIdToDelete, setEntity, idToDelete} = useCombosStore();
    const queryClient = useQueryClient();
    const [isDulce, setIsDulce] = useState(false);

    useEffect(() => {
        if (entity) {
            formik.setValues({
                nombre: entity.nombre || "",
                precio: entity.precio || "", 
                descripcion: entity.descripcion, 
            });
        }
    }, [entity]);


    const {
        data: combos,
    } = useQuery({
        queryKey: ["combos"],
        queryFn: CombosService,
    });


    const initialValues = {
        nombre: entity?.nombre || "",
        precio: entity?.precio || "",
        descripcion: entity?.descripcion,

    };

    const validationSchema = Yup.object({
        nombre: Yup.string().required("El nombre es obligatorio"),
        precio: Yup.string().required("El campo esobligatoio"),
        descripcion: Yup.string().required("El campo esobligatoio"),
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
                descripcion: values.descripcion,
                activo: true

            };

            if (isEdit) {
                if (entity) {
                    onUserUpdate(entity.idCombo || 0, payload);
                } else {
                    console.error('userStore is null');
                }
            } else {
                create(payload);
            }

        },
    });

    useEffect(() => {
        if (combos) {
            createRows(combos);
        }
    }, [combos]);

    const create = async (payload: any) => {
        try {


            const response = await CreaterCombos(payload)


            if (response.success === true) {
                setTimeout(() => {
                    setIsSubmitLogin(false);
                }, 2000);

                toast.success(response.message, {
                    position: "top-right",
                    autoClose: 2000,
                });

                queryClient.invalidateQueries({
                    queryKey: ["combos"],
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

    const createRows = (combos: any) => {
    
        if (!combos || combos.length === 0) {
            showNotifications(
                NotificationType.ERROR,
                "Ha ocurrido un error"
            );
            return;
        }

    
    
        const rows = combos.map((combos: ComboInterface) => ({
            nombre: combos.nombre,
            descripcion: combos.descripcion,
            precio: combos.precio,

            actions: (
                <div className="flex gap-2">
                    <button
                        onClick={() => onClickOpenForm(combos)}
                        className="p-2 bg-slate-400 text-white rounded-md hover:bg-blue-600 transition"
                        title="Editar"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
    
                    <button
                        onClick={() => onclickDelete(combos)}
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
    


    const onclickDelete = (combo: ComboInterface) => {
        setShowDeleteModal(true);
        setIdToDelete(combo.idCombo || 0);
    };

    const onClickOpenForm = (user: ComboInterface) => {
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
            accessorKey: 'descripcion',
            header: 'Descripcion',
        },
        {
            accessorKey: 'precio',
            header: 'Precio',
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

            const responseDelete = await DeletedCombos(idToDelete);
            if (responseDelete.success === true) {

                showNotifications(
                    NotificationType.SUCCESS,
                    responseDelete.message
                );
                queryClient.invalidateQueries({
                    queryKey: ["combos"],
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

            const responseDelete = await UpdateCombos(id, path);


            if (responseDelete.success === true) {
                setIdToDelete(null);

                queryClient.invalidateQueries({
                    queryKey: ["combos"],
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

