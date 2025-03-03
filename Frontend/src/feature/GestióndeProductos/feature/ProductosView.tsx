import BreadCrumb from "Common/BreadCrumb";
import TableContainer from "Common/TableContainer";
import { motion } from "framer-motion";
import { Shield, Users, PackageSearch } from "lucide-react";
import { DotLoader } from "react-spinners";
import DeleteModal from "Common/DeleteModal";
import { FormProductos } from "../components";
import { useProductos } from "../hooks";

export const ProductosView = () => {
  const {
    columns,
    userRows,
    handleCreateUser,
    formik,
    isSubmitLogin,
    showDeleteModal,
    onHideModal,
    onDeleteConfirm,
    isEdit,
    setIsDulce,
    isDulce
  } = useProductos();



  return (
    <>
      <BreadCrumb title={"Productos"} pageTitle={"Crear Productos"} />
      {isSubmitLogin && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
          <DotLoader color="#ffffff" size={80} />
        </div>
      )}


      <div className="w-full flex flex-col bg-gray-100 p-6 ">
        <DeleteModal
          show={showDeleteModal}
          onHide={onHideModal}
          onDelete={onDeleteConfirm}
        />
        <motion.div
          className="flex items-center justify-between h-20 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 p-6 rounded-md shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <PackageSearch size={48} className="text-white" />
            </motion.div>

            <motion.h3
              className="text-opacity-80 font-bold"
              initial={{ x: -10 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.5 }}
            >
              Gestión de Productos
            </motion.h3>

          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-4 pt-6">
          <div className="w-full md:w-2/5 p-4 bg-white rounded-md shadow-md h-[50%]">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Shield size={24} className="text-blue-600" /> {isEdit ? "Editar Producto" : "Crear Producto"}
                <div className="flex items-center gap-3 ml-[12%]">
                  <span className="text-lg font-semibold">{isDulce ? "Dulce" : "Churrasco"}</span>
                  <label className="relative inline-flex items-center cursor-pointer ">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isDulce}
                      onChange={() => {
                        setIsDulce(!isDulce);
                        formik.setFieldValue("tipoProducto", !isDulce ? "Dulce" : "Churrasco"); // ✅ Se actualiza Formik
                      }}
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 
            peer-checked:after:translate-x-full peer-checked:after:border-white 
            after:content-[''] after:absolute after:top-0.5 after:left-1 after:bg-white 
            after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
            peer-checked:bg-blue-600">
                    </div>
                  </label>
                </div>

              </h3>

              <p className="text-gray-600 text-sm">
                {isEdit
                  ? "Modifica la información del Producto seleccionado."
                  : "Rellena el formulario para crear un nuevo Producto."}
              </p>
            </motion.div>

            <div className="form-container w-full ">
              <FormProductos
                isEdit={isEdit}
                formik={formik}
                handleCreateUser={handleCreateUser}
              />
            </div>
          </div>

          <div className="w-full md:w-3/5 bg-white p-6 rounded-lg shadow-md">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Users size={24} className="text-blue-600" />
                Lista de Productos
              </h3>
              <p className="text-gray-600 text-sm">
                Visualiza, edita o elimina los Productos disponibles en la lista.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <TableContainer
                isPagination={true}
                columns={columns}
                data={userRows || []}
                isTfoot={true}
                isSelect={true}
                isGlobalFilter={true}
                divclassName="my-2 col-span-12 overflow-x-auto"
                tableclassName="display stripe group dataTable w-full text-sm align-middle whitespace-nowrap"
                theadclassName="border-b border-slate-200 dark:border-zink-500"
                thclassName="ltr:!text-left rtl:!text-right p-3 text-gray-700 bg-gray-200 font-semibold"
                tdclassName="p-3 border border-slate-200 text-gray-600"
                PaginationClassName="flex flex-col items-center mt-5 md:flex-row"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};


