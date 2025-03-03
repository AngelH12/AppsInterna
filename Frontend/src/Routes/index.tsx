import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { authProtectedRoutes, publicRoutes } from "./allRoutes";
import Layout from "Layout";
import NonAuthLayout from "Layout/NonLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import AuthProtected from "./AuthProtected";
import { useSessionStore } from "Common/Stores";

const queryClient = new QueryClient();

  
const RouteIndex = () => {
  const { session } = useSessionStore();

  const user = session?.rol
  return (
    <QueryClientProvider client={queryClient}>
      <React.Fragment>
        <Routes>
          {authProtectedRoutes.map((route: any, idx: number) => (
            <Route
              key={idx}
              path={route.path}
              element={
                <AuthProtected>
                  <Layout>
                    <Suspense fallback={<div>Loading...</div>}>
                      {route.roles && !route.roles.includes(user) ? (
                        <div>No tienes permiso para acceder a esta página</div>
                      ) : (
                        <route.component />
                      )}
                    </Suspense>
                  </Layout>
                </AuthProtected>
              }
            />
          ))}
          {publicRoutes.map((route: any, idx: number) => (
            <Route
              path={route.path}
              key={idx}
              element={
                <NonAuthLayout>
                  <Suspense fallback={<div>Loading...</div>}>
                    <route.component />
                  </Suspense>
                </NonAuthLayout>
              }
            />
          ))}
        </Routes>
        <ToastContainer />
      </React.Fragment>
    </QueryClientProvider>
  );
};

export default RouteIndex;
