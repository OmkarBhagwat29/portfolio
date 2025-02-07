import React, { FC } from "react";

interface ModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  children: React.ReactNode;
}
const Modal: FC<ModalProps> = ({ children, showModal, setShowModal }) => {
  return (
    showModal && (
      <div
        id="modal-background"
        className={`flex items-center justify-center fixed bg-slate-300 w-full h-full opacity-90`}
        onClick={(e) => {
          e.stopPropagation();
          setShowModal(false);
        }}
      >
        <div
          id="modal-content"
          className={`bg-slate-100 w-1/3 h-1/3 rounded-xl shadow-xl`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {children}
        </div>
      </div>
    )
  );
};

export default Modal;
