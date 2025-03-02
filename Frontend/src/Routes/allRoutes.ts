// dashboard
//import Ecommerce from "pages/Dashboards/Ecommerce";

import Login from "pages/Authentication/Login";
import Register from "pages/Authentication/Register";
import { lazy } from "react";

const Ecommerce = lazy(() => import("pages/Dashboards/Ecommerce"));
const User = lazy(() => import("pages/Usuarios/UsuariosView"));
const Productos = lazy(() => import("pages/Productos/Productos"));
const Combos = lazy(() => import("pages/Combos/Combos"));
const Guarniciones = lazy(() => import("pages/Guarniciones/Guarniciones"));

interface RouteObject {
  path: string;
  component: React.ComponentType<any>;
  exact?: boolean;
}

const authProtectedRoutes: Array<RouteObject> = [
  // Dashboard
  { path: "/", component: Ecommerce },
  { path: "/dashboard", component: Ecommerce },
  { path: "/User", component: User },
  { path: "/Productos", component: Productos },
  { path: "/Guarniciones", component: Guarniciones },
  { path: "/Combos", component: Combos },

];

const publicRoutes = [
  // authentication
  { path: "/login", component: Login },
  { path: "/register", component: Register },
];

export { authProtectedRoutes, publicRoutes };
