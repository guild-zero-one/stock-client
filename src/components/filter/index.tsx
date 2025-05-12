"use client";

import { useState, useEffect } from "react";

import ButtonFilter from "../button-filter";

type FilterProps = {
  title?: string;
  onChangeFilter: (value: string) => void;
};

export default function Filter({ title, onChangeFilter }: FilterProps) {
  const [activeButton, setActiveButton] = useState("Pedidos");

  const filters = ["Pedidos", "Nome", "Recente"];
  const index = filters.indexOf(activeButton);

  useEffect(() => {
    onChangeFilter(activeButton);
  }, [activeButton, onChangeFilter]);

  return (
    <div className="flex flex-col w-full gap-2">
      {/* Título */}
      <p className="w-full">{title ?? "Filtrar por"}</p>
      <div className="relative flex w-full border border-gray-default rounded-sm overflow-hidden bg-gray-light text-sm text-text-desactive">
        {/* Barra deslizante */}
        <div
          className={`absolute top-0 h-full bg-pink-default z-0 rounded-sm transition-all duration-200 ease-in-out
            ${index === 0 ? "left-0" : ""}
            ${index === 1 ? "left-1/3" : ""}
            ${index === 2 ? "left-2/3" : ""}
            ${
              filters.length === 3
                ? "w-1/3"
                : filters.length === 2
                ? "w-1/2"
                : "w-full"
            }`}
        />

        {/* Botões */}
        {filters.map((label) => (
          <ButtonFilter
            key={label}
            title={label}
            active={activeButton === label}
            onClick={() => setActiveButton(label)}
          />
        ))}
      </div>
    </div>
  );
}
