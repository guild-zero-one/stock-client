'use client'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { useRouter } from 'next/navigation';
import React from 'react';

type HeaderProps = {
    title: string;
    subtitle: string;
    backButton?: boolean;
    addRightButton?: boolean;
    rightIcon?: React.ReactNode;
    variant?: "primary" | "secondary";
    rightElementFunction?: () => void;
};
export default function Header({
    title,
    subtitle,
    backButton = true,
    addRightButton = false,
    rightIcon = '',
    variant = "primary",
    rightElementFunction = () => { },
}: HeaderProps) {
    const router = useRouter();
    const headerVariant = {
        primary: {
            primaryText: "text-(--pink-default)",
            secondaryText: "text-(--text-secondary)",
            icon: "text-(--pink-default)",
        },
        secondary: {
            primaryText: "text-(--white)",
            secondaryText: "text-(--white)",
            icon: "text-(--white)",
        }
};
return (
    <header className="w-full h-14 flex items-center justify-between px-4 border border-solid border-gray-300">
        <div className="flex justify-between items-center w-full relative">

            {/* Button Nav Voltar */}
            {backButton && (
                <button onClick={() => router.back()}
                    className="w-[24px] h-[24px]  absolute left-0 flex cursor-pointer">
                    <NavigateBeforeIcon className={`${headerVariant[variant].icon}`} />
                </button>
            )}

            {/* Centro */}
            <div className="w-fit flex justify-center absolute left-1/2 -translate-x-1/2">
                <div className="w-full flex flex-col grow h-fit font-[nunito] items-center justify-center">
                    <span className={`text-xs font-normal ${headerVariant[variant].secondaryText}`}>{subtitle}</span>
                    <span className={`text-sm font-bold ${headerVariant[variant].primaryText}`}>{title}</span>
                </div>
            </div>

            {/* Botão Adicional Direita */}
            {addRightButton && (
                <button 
                    className={`absolute cursor-pointer right-0 flex items-center gap-2 ${headerVariant[variant].icon}`}
                    onClick={rightElementFunction}
                >
                    {rightIcon}
                </button>
            )}
        </div>
    </header>

);
}

