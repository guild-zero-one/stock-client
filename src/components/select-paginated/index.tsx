"use client";

import React, { useRef, useEffect, useState } from "react";
import Select, {
  components,
  OptionProps,
  SingleValueProps,
} from "react-select";

interface SelectPaginatedProps<T> {
  name: string;
  label: string;
  value?: string | number;
  disabled?: boolean;
  size?: "small" | "default";
  handleChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: T[];
  optionKey: keyof T;
  optionValue: keyof T;
  optionName: keyof T;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
}

export default function SelectPaginated<T>({
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
  onLoadMore,
  hasMore = false,
  loading = false,
}: SelectPaginatedProps<T>) {
  const selectRef = useRef<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const sizeClasses = size === "small" ? "text-sm" : "text-base";

  // Converter options para formato do react-select
  const selectOptions = options.map(option => ({
    value: String(option[optionValue]),
    label: String(option[optionName]),
    data: option,
  }));

  // Encontrar a opção selecionada
  const selectedOption = selectOptions.find(
    option => option.value === String(value)
  );

  const handleSelectChange = (selectedOption: any) => {
    if (handleChange) {
      // Simular evento de change para manter compatibilidade
      const syntheticEvent = {
        target: {
          name,
          value: selectedOption?.value || "",
        },
      } as React.ChangeEvent<HTMLSelectElement>;

      handleChange(syntheticEvent);
    }
  };

  const handleMenuScrollToBottom = () => {
    if (hasMore && !loading && onLoadMore) {
      onLoadMore();
    }
  };

  // Componente customizado para as opções
  const CustomOption = (props: OptionProps<any>) => {
    return (
      <components.Option {...props}>
        <div className="py-2">{props.children}</div>
      </components.Option>
    );
  };

  // Componente customizado para o valor selecionado
  const CustomSingleValue = (props: SingleValueProps<any>) => {
    return (
      <components.SingleValue {...props}>
        <div className={sizeClasses}>{props.children}</div>
      </components.SingleValue>
    );
  };

  // Componente customizado para o dropdown indicator
  const CustomDropdownIndicator = (props: any) => {
    return (
      <components.DropdownIndicator {...props}>
        <svg
          className="w-5 h-5 text-gray-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </components.DropdownIndicator>
    );
  };

  // Componente customizado para o loading indicator
  const CustomLoadingIndicator = () => {
    return (
      <div className="py-2 text-sm text-gray-500">
        Carregando mais opções...
      </div>
    );
  };

  // Renderizar apenas no cliente para evitar problemas de hidratação
  if (!isMounted) {
    return (
      <div className="relative w-full group">
        <div
          className={`
            relative flex items-center w-full min-h-[3.5rem] rounded bg-white
            border 
            ${value ? "border-pink-default" : "border-gray-dark"}
            group-focus-within:border-pink-default
          `}
        >
          <div className="w-full px-4 py-3 text-gray-500">Carregando...</div>
          <label
            htmlFor={name}
            className={`
              absolute left-3 z-20 top-0 text-xs -translate-y-1/2 bg-white px-1 leading-none transition-all duration-200 pointer-events-none
              ${
                disabled
                  ? "text-gray-400"
                  : value
                  ? "text-pink-default"
                  : "text-gray-600"
              }
              group-focus-within:text-pink-default
            `}
          >
            {label}
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full group">
      <div
        className={`
          relative flex items-center w-full min-h-[3.5rem] rounded bg-white
          border 
          ${value ? "border-pink-default" : "border-gray-dark"}
          group-focus-within:border-pink-default
        `}
      >
        <Select
          ref={selectRef}
          name={name}
          value={selectedOption}
          onChange={handleSelectChange}
          options={selectOptions}
          isDisabled={disabled}
          isLoading={loading}
          onMenuScrollToBottom={handleMenuScrollToBottom}
          components={{
            Option: CustomOption,
            SingleValue: CustomSingleValue,
            DropdownIndicator: CustomDropdownIndicator,
            LoadingIndicator: CustomLoadingIndicator,
          }}
          styles={{
            control: base => ({
              ...base,
              minHeight: "auto",
              border: "none",
              borderRadius: "0",
              padding: "0 1rem",
              backgroundColor: "transparent",
              boxShadow: "none",
              "&:hover": {
                borderColor: "transparent",
              },
            }),
            valueContainer: base => ({
              ...base,
              padding: 0,
            }),
            input: base => ({
              ...base,
              margin: 0,
              padding: 0,
            }),
            indicatorSeparator: () => ({
              display: "none",
            }),
            dropdownIndicator: base => ({
              ...base,
              padding: "0 0.5rem",
            }),
            menu: base => ({
              ...base,
              zIndex: 9999,
              marginTop: "20px", // Adiciona espaço entre o select e a lista
            }),
            menuList: base => ({
              ...base,
              maxHeight: "200px",
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isSelected
                ? "#fce7f3"
                : state.isFocused
                ? "#fdf2f8"
                : "white",
              color: state.isSelected ? "#be185d" : "#374151",
              "&:hover": {
                backgroundColor: "#fdf2f8",
              },
            }),
          }}
          className="w-full"
          classNamePrefix="react-select"
        />

        <label
          htmlFor={name}
          className={`
            absolute left-3 z-20 top-0 text-xs -translate-y-1/2 bg-white px-1 leading-none transition-all duration-200 pointer-events-none
            ${
              disabled
                ? "text-gray-400"
                : value
                ? "text-pink-default"
                : "text-gray-600"
            }
            group-focus-within:text-pink-default
          `}
        >
          {label}
        </label>
      </div>
    </div>
  );
}
