'use client'
import React from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';

type InputProps = {
    label: string
    name: string
    type?: string
    value?: string | number
    messageHelper?: string
    showHelper?: boolean
    showIcon?: boolean
    iconSymbol?: React.ReactNode
    iconColor?: string
    inputSize?: "small" | "default" 
    inputStyle?: "default" | "success" | "info" | "error"
    helpersymbol?: "default" | "success" | "info" | "error"
    helperStatus?: "default" | "success" | "info" | "error"
    handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function Input({
    label,
    name,
    type = "text",
    value,
    messageHelper = "Este campo não deve ficar vazio!",
    showHelper = false,
    showIcon = false,
    iconSymbol = <AddCircleIcon />,
    iconColor = "pink-default",
    inputSize = "default",
    inputStyle = "default",
    helperStatus = inputStyle,
    helpersymbol = inputStyle,
    handleChange = () => { },

}: InputProps) {

    const sizeClasses =
    inputSize === "small"
      ? "py-2 text-sm"
      : "py-4 text-base";

      const iconSpace = showIcon ? "left-13" : "left-3";

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
            success: <CheckCircleOutlineIcon fontSize='small' className="text-ok-default" />,
            info: <InfoOutlineIcon fontSize='small' className="text-info-default" />,
            error: <ErrorOutlineIcon fontSize='small' className="text-error-default" />,
        };
    return (

        <div className={`relative flex border ${inputStyleClasses[inputStyle]} rounded focus-within:border-pink-default items-center px-4 gap-4`}>

            {/* Icone do input */}
            {showIcon && iconSymbol && (
                <div className={`text-${iconColor}`}>
                    {iconSymbol}
                </div>
            )}
            <input
                type={type} id={name} name={name} value={value} placeholder="" onChange={handleChange}
                className={`peer border border-gray-dark focus:border-pink-default rounded focus:outline-none w-full bg-white border-none ${sizeClasses}`}
            />

            {/* Label do input */}
            <label
                htmlFor={name}
                className={`
                absolute ${iconSpace}  z-1 top-0 text-xs -translate-y-1/2 bg-white leading-none transition-all pointer-events-none

                // Classes para o placeholder do input
                peer-placeholder-shown:text-sm
                peer-placeholder-shown:top-1/2
                peer-placeholder-shown:-translate-y-1/2
                peer-placeholder-shown:text-gray-m-dark

                // Classes para o label do input
                peer-focus:text-xs
                peer-focus:top-0
                peer-focus:-translate-y-1/2
                peer-focus:text-pink-default
                `}
            >
                {label}
            </label>

            {/* Mensagem de ajuda do input */}
            {showHelper && (
                <span className={`text-xs ${helperStatusClass[helperStatus]} mt-1 absolute top-full left-4 flex items-center gap-2`}>
                    {helperSymbol[helpersymbol]} {messageHelper}
                </span>
            )}
            

        </div>

    );
}
