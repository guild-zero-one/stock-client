"use client";
import { useState, useRef, useEffect } from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';

type DropdownAddProps = {
  children?: React.ReactNode;
};
export default function DropdownAdd({ children }: DropdownAddProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex" ref={dropdownRef}>
      {/* Botão que ativa o dropdown */}
      <button className="flex items-center rounded-md focus:outline-none w-fit h-fit hover:scale-145 transition-transform duration-300 cursor-pointer" onClick={toggleDropdown}>
        <MoreVertIcon />
      </button>

      {/* Lista da Lista */}
      {isOpen && (
        <div className="top-full right-0 z-10 absolute bg-white shadow-lg mt-2 border border-gray-dark rounded-sm w-fit">
          <ul className="py-2">{children}</ul>
        </div>
      )}
    </div>
  );
}
