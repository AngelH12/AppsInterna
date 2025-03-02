// dashboard
//import Ecommerce from "pages/Dashboards/Ecommerce";

import Login from "pages/Authentication/Login";
import Register from "pages/Authentication/Register";
import { lazy } from "react";

const Ecommerce = lazy(() => import("pages/Dashboards/Ecommerce"));

interface RouteObject {
  path: string;
  component: React.ComponentType<any>;
  exact?: boolean;
}

const authProtectedRoutes: Array<RouteObject> = [
  // Dashboard
  { path: "/", component: Ecommerce },
  { path: "/dashboard", component: Ecommerce },
];

const publicRoutes = [
  // authentication
  { path: "/login", component: Login },
  { path: "/register", component: Register },
];

export { authProtectedRoutes, publicRoutes };
