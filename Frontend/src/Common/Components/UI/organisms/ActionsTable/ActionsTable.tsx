import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

interface ActionsTableProps {
  cell?: any;
  children?: React.ReactNode;
  onClickEdith: () => void;
  onClickDelete: () => void;
  isCustomEnabled?: boolean;
}

export const ActionsTable: React.FC<ActionsTableProps> = ({
  cell,
  children,
  onClickEdith,
  onClickDelete,
  isCustomEnabled = false,
}) => {
  return (
    <div className="flex gap-3">
      {isCustomEnabled ? (
        <>
          <Link
            to="#!"
            className="flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md remove-item-btn bg-slate-100 text-slate-500 hover:text-custom-500 hover:bg-custom-100 dark:bg-zink-600 dark:text-zink-200 dark:hover:bg-custom-500/20 dark:hover:text-custom-500"
            onClick={() => {
              onClickEdith();
            }}
          >
            <Pencil className="size-4" />
          </Link>
        </>
      ) : (
        <>
          <Link
            to="#!"
            data-modal-target="addEmployeeModal"
            className="flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md edit-item-btn bg-slate-100 text-slate-500 hover:text-custom-500 hover:bg-custom-100 dark:bg-zink-600 dark:text-zink-200 dark:hover:bg-custom-500/20 dark:hover:text-custom-500"
            onClick={() => {
              onClickEdith();
            }}
          >
            <Pencil className="size-4" />
          </Link>
          <Link
            to="#!"
            className="flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md remove-item-btn bg-slate-100 text-slate-500 hover:text-custom-500 hover:bg-custom-100 dark:bg-zink-600 dark:text-zink-200 dark:hover:bg-custom-500/20 dark:hover:text-custom-500"
            onClick={() => {
              onClickDelete();
            }}
          >
            <Trash2 className="size-4" />
          </Link>
          {children}
        </>
      )}
    </div>
  );
};
