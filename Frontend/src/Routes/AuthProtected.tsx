import { useSessionStore } from "Common/Stores";
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface AuthProtectedProps {
  children: ReactNode;
}

const AuthProtected: React.FC<AuthProtectedProps> = ({ children }) => {

  const { session, isAuthtenticated } = useSessionStore();

  console.log("session", session)


  if (!session?.token || !isAuthtenticated) {
    return <Navigate to={{ pathname: "/login" }} />;
  }

  return <React.Fragment>{children}</React.Fragment>;
};

export default AuthProtected;
