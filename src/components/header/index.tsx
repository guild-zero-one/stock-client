"use client";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { useRouter } from "next/navigation";
import React from "react";

type HeaderProps = {
  title: string;
  subtitle: string;
  backButton?: boolean;
  variant?: "primary" | "secondary";
  children?: React.ReactNode;
  backRouter?: string;
};
export default function Header({
  title,
  subtitle,
  backButton = true,
  backRouter,
  variant = "primary",
  children,
}: HeaderProps) {
  const router = useRouter();

  const headerVariant = {
    primary: {
      primaryText: "text-pink-default",
      secondaryText: "text-text-secondary",
      icon: "text-pink-default",
    },
    secondary: {
      primaryText: "text-white",
      secondaryText: "text-white",
      icon: "text-white",
    },
  };
  return (
    <header className="flex justify-between items-center px-4 pt-4 pb-4 w-full h-14">
      <div className="relative flex justify-between items-center w-full h-full">
        {/* Button Nav Voltar */}
        {backButton && (
          <button
            onClick={() =>
              backRouter ? router.push(backRouter) : router.back()
            }
            className="left-0 absolute flex w-6 h-6 cursor-pointer"
            aria-label="Voltar para a página anterior"
          >
            <NavigateBeforeIcon className={`${headerVariant[variant].icon}`} />
          </button>
        )}

        {/* Centro */}
        <div className="left-1/2 absolute text-center -translate-x-1/2 transform">
          <div className="flex flex-col justify-center items-center">
            <span className={`text-xs ${headerVariant[variant].secondaryText}`}>
              {subtitle}
            </span>
            <span
              className={`text-sm font-bold ${headerVariant[variant].primaryText}`}
            >
              {title}
            </span>
          </div>
        </div>

        {/* Botão Adicional Direita */}
        {children && (
          <div className={`absolute right-0 ${headerVariant[variant].icon}`}>
            {children}
          </div>
        )}
      </div>
    </header>
  );
}
