import { cloneElement, isValidElement, ReactElement, ReactNode, useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { SvgIconProps } from "@mui/material/SvgIcon";

type ModalPopUpProps = {
    open?: boolean,
    closeMark?: boolean,
    onClose: () => void;
    icon?: ReactElement<SvgIconProps>
    title?: ReactNode;
    body?: ReactNode;
    footer?: ReactNode;
}

export default function Modal({
    open,
    closeMark = true,
    onClose,
    icon,
    title,
    body,
    footer
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
            <div className="top-1/2 left-1/2 z-50 fixed flex flex-col bg-white shadow-md p-4 w-[95vw] max-h-[70vh] -translate-x-1/2 -translate-y-1/2">

                {/* Modal Head */}
                <header className="flex justify-end w-full text-gray-dark text-2xl">
                    {closeMark && (
                        <button
                            className="hover:text-text-default transition-all cursor-pointer"
                            onClick={onClose}
                        >
                            <CloseIcon fontSize="inherit" />
                        </button>
                    )}
                </header>

                {/* Modal Body */}
                <main className="flex flex-col place-items-center mb-4 w-full grow">
                    
                    {/* Icon */}
                    <div className="text-pink-default text-9xl">
                        {icon && isValidElement(icon) &&
                            cloneElement(icon, {
                                fontSize: icon.props.fontSize || "inherit",
                            })}
                    </div>

                    {/* Título */}
                    <div className="font-lexend text-2xl">
                        {title}
                    </div>

                    {/* Descrição */}
                    <div className="w-full text-text-secondary text-sm">
                        {body}
                    </div>
                </main>

                <footer className="flex flex-col gap-2">
                    {footer}
                </footer>
            </div>
        </>
    );
}