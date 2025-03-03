import Login from "pages/Authentication/Login";
import Register from "pages/Authentication/Register";
import { lazy } from "react";

const Ecommerce = lazy(() => import("pages/Dashboards/Ecommerce"));
const User = lazy(() => import("pages/Usuarios/UsuariosView"));
const Productos = lazy(() => import("pages/Productos/Productos"));
const Combos = lazy(() => import("pages/Combos/Combos"));
const Guarniciones = lazy(() => import("pages/Guarniciones/Guarniciones"));



const Envios = lazy(() => import("pages/Envios/Envios"));
const Inventario = lazy(() => import("pages/Inventario/Inventario"));
const Pedidos = lazy(() => import("pages/Pedidos/Pedidos"));
const Reservas = lazy(() => import("pages/Reservas/Reservas"));
const Proveedores = lazy(() => import("pages/Proveedores/Proveedores"));



interface RouteObject {
  path: string;
  component: React.ComponentType<any>;
  exact?: boolean;
  roles?: string[];
}

const authProtectedRoutes: Array<RouteObject> = [
  { path: "/", component: Ecommerce, roles: ["Admin", "Gerente", "Cajero"] },
  { path: "/dashboard", component: Ecommerce, roles: ["Admin", "Gerente"] },
  { path: "/User", component: User, roles: ["Admin"] },
  { path: "/Productos", component: Productos, roles: ["Admin", "Gerente"] },
  { path: "/Guarniciones", component: Guarniciones, roles: ["Admin", "Gerente"] },
  { path: "/Combos", component: Combos, roles: ["Admin", "Gerente"] },
  { path: "/Envios", component: Envios, roles: ["Admin", "Gerente", "Repartidor"] },
  { path: "/Inventario", component: Inventario, roles: ["Admin", "Supervisor de Inventario"] },
  { path: "/Pedidos", component: Pedidos, roles: ["Admin", "Cajero"] },
  { path: "/Reservas", component: Reservas, roles: ["Admin", "Gerente", "Cliente"] },
  { path: "/Proveedores", component: Proveedores, roles: ["Admin", "Gerente"] },
];

const publicRoutes = [
  // authentication
  { path: "/login", component: Login },
  { path: "/register", component: Register },
];


export { authProtectedRoutes, publicRoutes };
