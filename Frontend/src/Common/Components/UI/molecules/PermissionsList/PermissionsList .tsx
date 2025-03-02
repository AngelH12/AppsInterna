import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PermissionsListProps {
  permissions: any[];
  selectedPermission: number;
  onSelect: (id: number) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const PermissionsList = ({
  permissions,
  selectedPermission,
  onSelect,
  searchTerm,
  onSearchChange,
}: PermissionsListProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="md:col-span-2 space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
          {t("AssigmentSpecialPermission.Permission.title")}
        </h3>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={t("AssigmentSpecialPermission.Permission.placeholder")}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-custom-500/20 focus:border-custom-500 dark:bg-zink-700 dark:border-zink-500 dark:text-gray-200"
          />
        </div>
      </div>

      <div className="overflow-y-auto max-h-96 space-y-2 pr-2">
        {permissions.map((permission) => (
          <button
            key={permission.id}
            type="button"
            onClick={() => onSelect(permission.id)}
            className={`w-full px-4 py-3 text-sm rounded-lg text-left transition-all ${
              selectedPermission === permission.id
                ? "bg-custom-500 text-white shadow-lg shadow-custom-500/20"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-zink-700 dark:text-gray-200 dark:hover:bg-zink-600"
            }`}
          >
            {permission.option.description}
          </button>
        ))}
      </div>
    </div>
  );
};
