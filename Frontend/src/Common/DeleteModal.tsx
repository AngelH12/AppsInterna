import React from "react";
import Modal from "./Components/Modal";

// Icons
import { X } from "lucide-react";

// Image
import { useTranslation } from "react-i18next";
import { DottedButton } from "./Buttons";

interface props {
  show: boolean;
  onHide: () => void;
  onDelete: () => void;
}

const DeleteModal: React.FC<props> = ({ show, onHide, onDelete }) => {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <Modal
        show={show}
        onHide={onHide}
        id="deleteModal"
        modal-center="true"
        className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
        dialogClassName="w-screen md:w-[25rem] bg-white shadow rounded-md dark:bg-zink-600"
      >
        <Modal.Body className="max-h-[calc(theme('height.screen')_-_180px)] overflow-y-auto px-6 py-8">
          <div className="float-right">
            <button
              data-modal-close="deleteModal"
              className="transition-all duration-200 ease-linear text-slate-500 hover:text-red-500"
            >
              <X className="size-5" onClick={onHide} />
            </button>
          </div>
          <img  src={"https://e7.pngegg.com/pngimages/74/731/png-clipart-rubbish-bins-waste-paper-baskets-open-trash-can-waste-waste-containment.png"} alt="" className="block h-32 rounded-full mx-auto" />
          <div className="mt-5 text-center">
            <h5 className="mb-1">
              ¿Estás seguro de eliminar este registro?
            </h5>
            <p className="text-slate-500 dark:text-zink-200">
              Esta acción no se puede deshacer. Por favor, confirma si deseas continuar.
            </p>
            <div className="flex justify-center gap-4 mt-6">

              <DottedButton
                onClick={onHide}
                text={'Cancelar'}
                variant='standard'
              />
              <DottedButton
                onClick={onDelete}
                text={'Eliminar'}
                variant='error'
              />

            </div>
          </div>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default DeleteModal;
