import { useQuery, useQueryClient } from '@tanstack/react-query';
import { NotificationType, showNotifications } from 'helpers/toas_notification';
import { Edit, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react'
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { Link } from 'react-router-dom';
import { CombosService, CreaterCombos, DeletedCombos, UpdateCombos } from 'services/service.cruds/Combos';
import { ComboInterface } from 'interfaces/Combos';
import { useCombosStore } from 'feature/Combos/store';
import { useInventarioStore } from '../store';
import { InventarioInterface } from 'interfaces/Ingrediente/Ingrediente';
import { InventarioService } from 'services/service.cruds/Inventario/Inventario';

export const useInventarioView = () => {
    const [userRows, setUserRows] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitLogin, setIsSubmitLogin] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showActiveUsers, setShowActiveUsers] = useState(true);
    const { setIsEdit, entity, isEdit, setIdToDelete, setEntity, idToDelete} = useInventarioStore();
    const queryClient = useQueryClient();
    const [isDulce, setIsDulce] = useState(false);

    useEffect(() => {
        if (entity) {
            formik.setValues({
                idIngrediente: entity.idIngrediente || 0,
                cantidad: entity.cantidad || "", 
                tipoMovimiento: entity.tipoMovimiento, 
                detalle: entity.detalle, 
            });
        }
    }, [entity]);


    const {
        data: inventario,
    } = useQuery({
        queryKey: ["inventario"],
        queryFn: InventarioService,
    });


    const initialValues = {
        idIngrediente: entity?.idIngrediente || 0,
        cantidad: entity?.cantidad || "",
        tipoMovimiento: entity?.tipoMovimiento,
        detalle: entity?.detalle

    };

    const validationSchema = Yup.object({
        idIngrediente: Yup.string().required("El campo esobligatoio"),
        cantidad: Yup.string().required("El campo esobligatoio"),
        tipoMovimiento: Yup.string().required("El campo esobligatoio"),
        detalle: Yup.string().required("El campo esobligatoio"),

    });

    const formik = useFormik({
        initialValues,
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            setIsSubmitLogin(true);

            const payload = {
                idIngrediente: values.idIngrediente,
                cantidad: values.cantidad,
                tipoMovimiento: values.tipoMovimiento,
                detalle: values.detalle

            };

            if (isEdit) {
                if (entity) {
                    onUserUpdate(entity.idInventario || 0, payload);
                } else {
                    console.error('userStore is null');
                }
            } else {
                create(payload);
            }

        },
    });

    useEffect(() => {
        if (inventario) {
            createRows(inventario);
        }
    }, [inventario]);

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

    
    
        const rows = combos.map((combos: InventarioInterface) => ({
            ingrediente: combos.ingrediente.nombre,
            descripcion: combos.detalle,
            precio: combos.ingrediente.precioUnitario,
            cantidad: combos.cantidad,

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
    


    const onclickDelete = (combo: InventarioInterface) => {
        setShowDeleteModal(true);
        setIdToDelete(combo.idInventario || 0);
    };

    const onClickOpenForm = (user: InventarioInterface) => {
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
            accessorKey: 'ingrediente',
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
            accessorKey: 'cantidad',
            header: 'cantidad',
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
