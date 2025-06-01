import { useEffect, useState } from "react";

import {
  CloseOutlined,
  CheckCircleOutlined,
  EmojiSymbols,
  ErrorOutlined,
  InfoOutlined,
} from "@mui/icons-material";

interface ToastProps {
  title: string;
  message: string;
  type: "default" | "success" | "error" | "info";
  outlined?: boolean;
  light?: boolean;
  duration?: number;
}

export default function Toast({
  title,
  message,
  type,
  outlined,
  light,
  duration = 5000,
}: ToastProps) {
  const [visible, setVisible] = useState(true);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 300);

    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(() => {
        setVisible(false);
      }, 200);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      setVisible(false);
    }, 200);
  };

  if (!visible) return null;

  const iconSymbolClass = {
    default: <EmojiSymbols />,
    success: <CheckCircleOutlined />,
    error: <ErrorOutlined />,
    info: <InfoOutlined />,
  };

  const typeClass = {
    default: "bg-gray-m-dark text-white",
    success: "bg-ok-default text-white",
    error: "bg-error-default text-white",
    info: "bg-info-default text-white",
  };

  const lightTypeClass = {
    default: "bg-gray-default text-gray-m-dark",
    success: "bg-ok-light text-ok-default",
    error: "bg-error-light text-error-dark",
    info: "bg-info-light text-info-dark",
  };

  const outlineTypeClass = {
    default: "bg-white text-gray-m-dark border-gray-m-dark",
    success: "bg-white text-ok-default border-ok-dark",
    error: "bg-white text-error-dark border-error-default",
    info: "bg-white text-info-dark border-info-default",
  };

  let variantClass = typeClass[type];

  if (outlined) {
    variantClass = `${outlineTypeClass[type]} border-2`;
  } else if (light) {
    variantClass = lightTypeClass[type];
  }

  return (
    <div
      className={`
        w-full absolute z-50 flex p-4 shadow-lg rounded-b-2xl 
        transition-all duration-500 ease-in-out transform
        ${variantClass} 
        ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
      `}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-start h-full">{iconSymbolClass[type]}</div>
        <div className="flex flex-col w-full px-4 gap-0.5">
          <p className="text-xs font-light">{title}</p>
          <p className="text-sm">{message}</p>
        </div>
        <div
          className="flex items-start h-full cursor-pointer"
          onClick={handleClose}
        >
          <CloseOutlined />
        </div>
      </div>
    </div>
  );
}
