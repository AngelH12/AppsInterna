import { motion } from "framer-motion";
import { DottedButton } from "Common/Buttons";
import { BasicInput, Carousel } from "Common/Components";
import { useLogin } from "feature/login/hooks";
import { DotLoader } from "react-spinners";
import "react-toastify/dist/ReactToastify.css";

export const LoginView = () => {
  const { formik, showPassword, loading, isSubmitLogin, isMobile, images } = useLogin();

  if (!formik) {
    return <p className="text-center text-gray-500">Cargando...</p>;
  }

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-r from-purple-600 via-pink-500 to-red-500">
      {isSubmitLogin && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
          <DotLoader color="#ffffff" size={80} />
        </div>
      )}
      <form className={`m-8 ${isMobile ? "w-[90%]" : "w-[50%]"}`} onSubmit={formik.handleSubmit}>
        <motion.div
          className="flex flex-col md:flex-row p-8 bg-white rounded-xl shadow-2xl justify-center items-center mx-auto max-w-4xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hidden md:block w-1/2 p-4">
            <Carousel images={images} />
          </div>

          <div className="w-full md:w-1/2 p-6">
            <motion.h2
              className="text-3xl font-bold text-center text-gray-900 mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Bienvenido al Sistema
            </motion.h2>
            <motion.p
              className="text-center text-gray-600 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Acceda a su cuenta para gestionar pedidos y productos.
            </motion.p>

            <div className="mb-5">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <BasicInput
                  type="text"
                  id="Correo"
                  value={formik.values.Correo}
                  onChange={formik.handleChange}
                  placeholder="Correo electrónico"
                  label="Correo electrónico"
                  isError={!!(formik.touched.Correo && formik.errors.Correo)}
                  errorMessage={formik.errors.Correo || ""}
                  onBlur={formik.handleBlur}
                />
              </motion.div>
            </div>

            <div className="mb-5 relative">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <BasicInput
                  type={showPassword ? "text" : "password"}
                  id="Contraseña"
                  value={formik.values.Contraseña}
                  onChange={formik.handleChange}
                  placeholder="Contraseña"
                  label="Contraseña"
                  isError={!!(formik.touched.Contraseña && formik.errors.Contraseña)}
                  errorMessage={formik.errors.Contraseña || ""}
                  onBlur={formik.handleBlur}
                />
              </motion.div>
            </div>

            <div className="flex justify-center pt-4">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                <DottedButton type="submit" text={"Iniciar sesión"} disabled={loading} />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </form>
    </div>
  );
};
