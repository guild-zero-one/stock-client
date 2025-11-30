import React from "react";
import { accentCorrections } from "./constants";

export function fixAccents(text: string): string {
  // Aplica correções de acentuação
  let corrected = text;
  Object.entries(accentCorrections).forEach(([wrong, correct]) => {
    const regex = new RegExp(`\\b${wrong}\\b`, "gi");
    corrected = corrected.replace(regex, correct);
  });
  return corrected;
}

export function formatCurrency(value: number): string {
  return `R$ ${value.toFixed(0)}`;
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "";
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return "";
    return dateObj.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export function formatStatusValue(value: string): React.ReactNode {
  const upperValue = value.toUpperCase();
  if (upperValue.includes("POSITIVO")) {
    return <span className="text-green-600 font-semibold">{value}</span>;
  }
  if (upperValue.includes("NEGATIVO")) {
    return <span className="text-red-600 font-semibold">{value}</span>;
  }
  return value;
}

export function formatKeyToTitle(key: string): string {
  // Converte snake_case para título legível e corrige acentuação
  const title = key
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
  return fixAccents(title);
}

