import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useSessionStore } from "Common/Stores";
import { LoginService } from "services/service.cruds/login";
import { toast } from "react-toastify";
import { LoginResponse } from "interfaces";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);



  const navigate = useNavigate();
  const { setSession, setIsAuthtenticated } = useSessionStore();
  const [isSubmitLogin, setIsSubmitLogin] = useState(false);
  const [{ success, error }, setIsLogued] = useState({
    success: false,
    error: false,
    errorMessage: "",
  });

  const initialValues = {
    Correo: "",
    Contraseña: "",
  };

  const validationSchema = Yup.object({
    Correo: Yup.string()
      .required("El correo es obligatorio"),
    Contraseña: Yup.string().required("La contraseña es obligatoria"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitLogin(true);
      setLoading(true);

      const payload = {
        Correo: values.Correo,
        Contraseña: values.Contraseña,
      };
      try {
        const response: LoginResponse = await LoginService(payload);

        console.log("response",    response)
        if (response.message === "Inicio de sesión exitoso.") {
          setSession(response );
          setIsLogued({ success: true, error: false, errorMessage: "" });
          setTimeout(() => {
            setIsAuthtenticated(true);
            navigate("/dashboard");
            setIsSubmitLogin(false);
          }, 2000);

          toast.success(response.message, {
            position: "top-right",
            autoClose: 2000,
          });

        } else {
          setIsLogued({ success: false, error: true, errorMessage: "" });
          setTimeout(() => {
            setIsAuthtenticated(false);
            setIsSubmitLogin(false);
          }, 2000);

          toast.error(response.message, {
            position: "top-right",
            autoClose: 2000,
          });

        }
      } catch (error) {
        toast.error("Autenticación fallida", {
          position: "top-right",
          autoClose: 2000,
        });
      } finally {
        setLoading(false);
        setTimeout(() => {
          setIsSubmitLogin(false);
        }, 2000);
      }
    },
  });

  const images = [
    "https://img.freepik.com/psd-gratis/deliciosa-carne-parrilla-patatas-asadas-romero_632498-26078.jpg?t=st=1740898592~exp=1740902192~hmac=16709b16f3afd5a46e3fe14e89714ca8adba48b8789878690c9ef7626f20dfc7&w=740",
    "https://media.istockphoto.com/id/2162068601/es/vector/barbecue-party.jpg?s=612x612&w=0&k=20&c=6kHfFLxi8iw9HO3qZq80K_cXOt7q3yRptWqpnPhd4ho=",
    "https://media.istockphoto.com/id/2168640312/es/vector/bbq-party-with-cheerful-friends-drinking-beer-and-grilling-meat-on-grill-in-park-or-in.webp?s=2048x2048&w=is&k=20&c=ipk8obHKWWo4SZjg9r2oZBsbt3_1tJGfmxDINVSobXs="
  ];



  return {
    formik,
    error,
    loading,
    showPassword,
    setShowPassword,
    isSubmitLogin,
    success,
    isMobile,
    images
  };
};
