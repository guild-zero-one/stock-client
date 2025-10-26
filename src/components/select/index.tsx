"use client";
import React from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

interface SelectProps<T> {
  name: string;
  label: string;
  value?: string | number;
  disabled?: boolean;
  size?: "small" | "default";
  handleChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options?: T[];
  optionKey: keyof T;
  optionValue: keyof T;
  optionName: keyof T;
}

export default function Select<T>({
  name,
  label,
  value,
  disabled = false,
  size = "default",
  handleChange = () => {},
  options = [],
  optionKey,
  optionValue,
  optionName,
}: SelectProps<T>) {
  const sizeClasses = size === "small" ? "py-2 text-sm" : "py-4 text-base";

  return (
    <div>
      <div
        className={`relative flex border border-gray-dark rounded focus-within:border-pink-default items-center px-4 bg-white`}
      >
        {/* SELECT */}
        <select
          name={name}
          id={name}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={`peer appearance-none bg-white w-full border-none focus:outline-none pr-8 ${sizeClasses} ${
            disabled ? "text-gray-400" : ""
          }`}
        >
          <option value="" disabled hidden></option>
          {Array.isArray(options) &&
            options.map(option => (
              <option
                className=""
                key={String(option[optionKey])}
                value={String(option[optionValue])}
              >
                {String(option[optionName])}
              </option>
            ))}
        </select>

        {/* ÍCONE DE DROPDOWN */}
        <div className="right-3 absolute text-gray-500 pointer-events-none">
          <ArrowDropDownIcon />
        </div>

        {/* LABEL FLUTUANTE */}
        <label
          htmlFor={name}
          className={`
            absolute left-3 z-1 top-0 text-xs -translate-y-1/2 bg-white leading-none transition-all pointer-events-none
            ${disabled ? "text-gray-400" : ""}

            peer-placeholder-shown:text-sm
            peer-placeholder-shown:top-1/2
            peer-placeholder-shown:-translate-y-1/2
            peer-placeholder-shown:text-gray-m-dark

            peer-focus:text-xs
            peer-focus:top-0
            peer-focus:-translate-y-1/2
            peer-focus:text-pink-default
          `}
        >
          {label}
        </label>
      </div>
    </div>
  );
}
