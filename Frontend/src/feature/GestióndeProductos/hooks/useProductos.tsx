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
import { useProductosStore } from '../store';

export const useProductos = () => {
    const [userRows, setUserRows] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitLogin, setIsSubmitLogin] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showActiveUsers, setShowActiveUsers] = useState(true);
    const { setIsEdit, entity, isEdit, setIdToDelete, setEntity, idToDelete} = useProductosStore();
    const queryClient = useQueryClient();
    const [isDulce, setIsDulce] = useState(false);

    useEffect(() => {
        if (entity) {
            formik.setValues({
                nombre: entity.nombre || "",
                descripcion: entity.descripcion || "",
                precio: entity.precio || "", 
                tipoProducto: isDulce ? "Dulce" : "Churrasco",  
                stock: entity.stock, 
                unidadMedida: entity.unidadMedida,


            });
        }
    }, [entity]);

    useEffect(() => {
        if (entity?.tipoProducto) {
            setIsDulce(entity.tipoProducto === "Dulce");
        }
    }, [entity]);

    const {
        data: productos,
    } = useQuery({
        queryKey: ["productos"],
        queryFn: ProductosService,
    });


    const initialValues = {
        nombre: entity?.nombre || "",
        descripcion: entity?.descripcion || "",
        precio: entity?.precio || "",
        tipoProducto: entity?.tipoProducto || isDulce ? "Dulce" : "Churrasco",
        stock: entity?.stock || "",
        unidadMedida: entity?.unidadMedida,

    };

    const validationSchema = Yup.object({
        nombre: Yup.string().required("El nombre es obligatorio"),
        descripcion: Yup.string().required("El campo esobligatoio"),
        precio: Yup.string().required("El campo esobligatoio"),
        tipoProducto: Yup.string().required("El campo esobligatoio"),
        stock: Yup.string().required("El campo esobligatoio"),
        unidadMedida: Yup.string().required("El campo esobligatoio"),

    });

    const formik = useFormik({
        initialValues,
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            setIsSubmitLogin(true);

            const payload = {
                nombre: values.nombre,
                descripcion: values.descripcion,
                precio: values.precio,
                tipoProducto: isDulce ? "Dulce" : "Churrasco",
                stock: values.stock,
                unidadMedida: values.unidadMedida,
                imagen: 'https://example.com/puyazo.jpg',
                activo: true

            };

            if (isEdit) {
                if (entity) {
                    onUserUpdate(entity.idProducto || 0, payload);
                } else {
                    console.error('userStore is null');
                }
            } else {
                create(payload);
            }

        },
    });

    useEffect(() => {
        if (productos) {
            createRows(productos);
        }
    }, [productos, isDulce]);

    const create = async (payload: any) => {
        try {


            const response = await CreaterProductos(payload)


            if (response.success === true) {
                setTimeout(() => {
                    setIsSubmitLogin(false);
                }, 2000);

                toast.success(response.message, {
                    position: "top-right",
                    autoClose: 2000,
                });

                queryClient.invalidateQueries({
                    queryKey: ["productos"],
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

    const createRows = (productos: any) => {
    
        if (!productos || productos.length === 0) {
            showNotifications(
                NotificationType.ERROR,
                "Ha ocurrido un error"
            );
            return;
        }

        const filtroTipoProducto = isDulce ? "Dulce" : "Churrasco"; 
        const productosFiltrados = productos.filter((producto: { tipoProducto: string; }) => producto.tipoProducto === filtroTipoProducto);

    
        const rows = productosFiltrados.map((productos: ProductoInterface) => ({
            nombre: productos.nombre,
            descripcion: productos.descripcion,
            precio: productos.precio,
            stock: productos.stock,

            actions: (
                <div className="flex gap-2">
                    <button
                        onClick={() => onClickOpenForm(productos)}
                        className="p-2 bg-slate-400 text-white rounded-md hover:bg-blue-600 transition"
                        title="Editar"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
    
                    <button
                        onClick={() => onclickDelete(productos)}
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
    


    const onclickDelete = (user: ProductoInterface) => {
        setShowDeleteModal(true);
        setIdToDelete(user.idProducto || 0);
    };

    const onClickOpenForm = (user: ProductoInterface) => {
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

            const responseDelete = await DeletedProductos(idToDelete);
            if (responseDelete.success === true) {

                showNotifications(
                    NotificationType.SUCCESS,
                    responseDelete.message
                );
                queryClient.invalidateQueries({
                    queryKey: ["productos"],
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

            const responseDelete = await UpdateProductos(id, path);


            if (responseDelete.success === true) {
                setIdToDelete(null);

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
        setIsDulce,
        isDulce

    }
}


