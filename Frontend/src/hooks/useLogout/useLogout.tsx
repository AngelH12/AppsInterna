import { useSessionStore } from "Common/Stores";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const { clearSession } = useSessionStore();
  const navigate = useNavigate();

  const logout = () => {
    clearSession();
    navigate("/login");
  };

  return {
    logout,
  };
};
