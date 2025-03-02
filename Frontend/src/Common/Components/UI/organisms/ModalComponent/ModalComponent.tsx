import Modal from "Common/Components/Modal";
import { ReactNode } from "react";

interface ModalProps {
  onHide: () => void;
  show: boolean;
  //modalCenter: "true" | "false";
  modalTitle: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export const ModalComponent: React.FC<ModalProps> = ({
  onHide,
  show,
  //modalCenter,
  modalTitle,
  children,
  size,
}) => {
  const dialogBaseClass =
    "w-screen  bg-white shadow rounded-md dark:bg-zink-600";

  const sizeClass = {
    sm: "md:w-[20rem]",
    md: "md:w-[30rem]",
    lg: "md:w-[35rem]",
    xl: "md:w-[45rem]",
  };

  return (
    <Modal
      onHide={onHide}
      show={show}
      modal-center="true"
      className={`fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-1/2"`}
      dialogClassName={` ${dialogBaseClass}  ${sizeClass[size || "md"]}`}
    >
      <Modal.Header
        className="flex items-center justify-between p-4 border-b  dark:border-zink-500"
        closeButtonClass="transition-all duration-200 ease-linear text-slate-400 hover:text-red-500"
      >
        <Modal.Title className="text-16">{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pb-20 max-h-[calc(theme('height.screen')_-_180px)] p-4 overflow-y-scroll  md:overflow-y-visible md:pb-4">
        {children}
      </Modal.Body>
    </Modal>
  );
};
