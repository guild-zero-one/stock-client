"use client";

import React from "react";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";

type InputProps = {
  label: string;
  name: string;
  type?: string;
  value?: string | number;
  messageHelper?: string;
  showHelper?: boolean;
  iconSymbol?: React.ReactNode;
  iconColor?: string;
  disabled?: boolean;
  size?: "small" | "default";
  status?: "default" | "success" | "info" | "error";
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
};

export default function Input({
  label,
  name,
  type = "text",
  value,
  messageHelper = "Este campo não deve ficar vazio!",
  showHelper = false,
  iconSymbol,
  iconColor = "pink-default",
  disabled = false,
  size = "default",
  status = "default",
  handleChange = () => {},
  maxLength,
}: InputProps) {
  const sizeClasses = size === "small" ? "py-2 text-sm" : "py-4 text-base";

  const iconSpace = iconSymbol ? "left-13" : "left-3";

  const inputStyleClasses = {
    default: "border-gray-dark",
    success: "border-ok-default",
    info: "border-info-default",
    error: "border-error-default",
  };

  const helperStatusClass = {
    default: "text-gray-m-dark",
    success: "text-ok-default",
    info: "text-info-default",
    error: "text-error-default",
  };

  const helperSymbol = {
    default: "",
    success: (
      <CheckCircleOutlineIcon fontSize="small" className="text-ok-default" />
    ),
    info: <InfoOutlineIcon fontSize="small" className="text-info-default" />,
    error: <ErrorOutlineIcon fontSize="small" className="text-error-default" />,
  };
  return (
    <div>
      <div
        className={`relative flex border ${inputStyleClasses[status]} rounded focus-within:border-pink-default ${value ? 'border-pink-default' : ''} items-center px-4 gap-4 bg-white`}
      >
        {/* Icone do input */}
        {iconSymbol && <div className={`text-${iconColor}`}>{iconSymbol}</div>}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          maxLength={maxLength}
          placeholder=" "
          className={`peer border border-gray-dark focus:border-pink-default rounded focus:outline-none w-full bg-white border-none ${sizeClasses} ${
            disabled ? "text-gray-400" : "inherit"
          }`}
        />

        {/* Label do input */}
        <label
          htmlFor={name}
          className={`
                        absolute ${iconSpace} z-1 top-0 text-xs -translate-y-1/2 bg-white leading-none transition-all duration-200 ease-in-out pointer-events-none ${
            disabled ? "text-gray-400" : "text-pink-default"
          }

                        // Classes para quando o placeholder está visível (input vazio)
                        peer-placeholder-shown:text-sm
                        peer-placeholder-shown:top-1/2
                        peer-placeholder-shown:-translate-y-1/2
                        peer-placeholder-shown:text-gray-m-dark

                        // Classes para quando o input tem foco
                        peer-focus:text-xs
                        peer-focus:top-0
                        peer-focus:-translate-y-1/2
                        peer-focus:text-pink-default`}
        >
          {label}
        </label>
      </div>

      {/* Mensagem de ajuda do input */}
      {showHelper && (
        <span
          className={`text-xs ${helperStatusClass[status]} flex items-center gap-1 mt-1`}
        >
          {helperSymbol[status]} {messageHelper}
        </span>
      )}
    </div>
  );
}
