/**
 * Aplica máscara de telefone brasileiro no formato (11) 99999-9999
 * @param valor - String contendo apenas números
 * @returns String formatada com a máscara
 */
export const aplicarMascaraTelefone = (valor: string): string => {
  // Remove tudo que não é dígito
  const apenasDigitos = valor.replace(/\D/g, "");

  // Aplica a máscara progressivamente
  if (apenasDigitos.length === 0) {
    return "";
  } else if (apenasDigitos.length === 1) {
    return `(${apenasDigitos}`;
  } else if (apenasDigitos.length === 2) {
    return `(${apenasDigitos})`;
  } else if (apenasDigitos.length <= 6) {
    return `(${apenasDigitos.slice(0, 2)}) ${apenasDigitos.slice(2)}`;
  } else if (apenasDigitos.length <= 10) {
    return `(${apenasDigitos.slice(0, 2)}) ${apenasDigitos.slice(
      2,
      6
    )}-${apenasDigitos.slice(6)}`;
  } else {
    return `(${apenasDigitos.slice(0, 2)}) ${apenasDigitos.slice(
      2,
      7
    )}-${apenasDigitos.slice(7, 11)}`;
  }
};

/**
 * Remove a máscara de telefone, retornando apenas os números
 * @param valor - String com máscara de telefone
 * @returns String contendo apenas números
 */
export const removerMascaraTelefone = (valor: string): string => {
  return valor.replace(/\D/g, "");
};
