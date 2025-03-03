import {
  Beef,
  Clock,
  FolderKanban,
  Hotel,
  PackageOpen,
  PackageSearch,
  Plane,
  Salad,
  ShieldEllipsis,
  UserPlus,
  Utensils
} from "lucide-react";

const menuData: any = [
  {
    id: "user",
    label: "Usuarios y Autenticación",
    link: "/user",
    icon: <FolderKanban />,
    subItems: [
      {
        id: 'user',
        label: 'Usuarios',
        link: '/User',
        parentId: 'user',
      },
    ],
  },

  {
    id: "productos",
    label: "Productos",
    link: "/productos",
    icon: <PackageSearch />,
    subItems: [
      {
        id: 'user',
        label: 'Productos',
        link: '/Productos',
        parentId: 'productos',
      },
    ],
  },


  {
    id: "guarniciones",
    label: "Gestión de Guarniciones",
    link: "/guarniciones ",
    icon: <Salad />,
    subItems: [
      {
        id: 'guarniciones',
        label: 'Guarniciones',
        link: '/Guarniciones',
        parentId: 'guarniciones',
      },
    ],
  },
  {
    id: "Combos",
    label: "Gestión de Combos",
    link: "/Combos",
    icon: <Utensils />,
    subItems: [
      {
        id: 'user',
        label: 'Combos',
        link: '/Combos',
        parentId: 'Combos',
      },
    ],
  },






  {
    id: "Envios",
    label: "Gestión de Envios",
    link: "/Envios",
    icon: <Plane />,
    subItems: [
      {
        id: 'Envios',
        label: 'Envios',
        link: '/Envios',
        parentId: 'Envios',
      },
    ],
  },
  {
    id: "Inventario",
    label: "Gestión de Inventario",
    link: "/Inventario",
    icon: <PackageOpen />,
    subItems: [
      {
        id: 'user',
        label: 'Inventario',
        link: '/Inventario',
        parentId: 'Inventario',
      },
    ],
  },  
  
  {
    id: "Pedidos",
    label: "Gestión de Pedidos",
    link: "/Pedidos",
    icon: <Clock />,
    subItems: [
      {
        id: 'Pedidos',
        label: 'Pedidos',
        link: '/Pedidos',
        parentId: 'Pedidos',
      },
    ],
  },  {
    id: "Reservas",
    label: "Gestión de Reservas",
    link: "/Reservas",
    icon: <Hotel />,
    subItems: [
      {
        id: 'user',
        label: 'Reservas',
        link: '/Reservas',
        parentId: 'Reservas',
      },
    ],
  },
  {
    id: "Proveedores",
    label: "Gestión de Proveedores",
    link: "/Proveedores",
    icon: <UserPlus />,
    subItems: [
      {
        id: 'user',
        label: 'Proveedores',
        link: '/Proveedores',
        parentId: 'Proveedores',
      },
    ],
  },







];

export { menuData };
