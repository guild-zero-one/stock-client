import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';

type ModalPopUpProps = {
    open?: boolean,
    closeMark?: boolean,
    onClose: () => void;
}

export default function Modal({
  open,
  closeMark = false,
  onClose,
}: ModalPopUpProps) {
  if (!open) return null;

  return (
    <>
      {/* Modal Background */}
      <div
        className="top-0 left-0 z-50 fixed bg-black/20 w-screen h-screen"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="top-1/2 left-1/2 z-50 fixed flex flex-col bg-white shadow-md p-4 w-[95vw] h-[70vh] -translate-x-1/2 -translate-y-1/2">
        {/* Modal Head */}
        <header className="flex justify-end w-full text-gray-dark text-lg">
          <button
            className="hover:text-text-default transition-all cursor-pointer"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </header>

        {/* Modal Body */}
        <main className="flex flex-col place-items-center w-full grow">
          <div className="font-lexend text-2xl">
            <h2>Título</h2>
          </div>

          <div className="w-full text-text-secondary text-sm">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate fugit eum nulla
              facilis tempora distinctio...
            </p>
          </div>
        </main>

        <footer>
          <h2>Footer</h2>
        </footer>
      </div>
    </>
  );
}