import {
  Beef,
  FolderKanban,
  PackageSearch,
  Salad,
  ShieldEllipsis,
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
];

export { menuData };
