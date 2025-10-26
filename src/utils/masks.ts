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
 * Aplica máscara de telefone de forma inteligente, removendo caracteres de trás para frente
 * @param valor - String atual com máscara
 * @param novoValor - String nova sendo digitada
 * @returns String formatada com a máscara aplicada corretamente
 */
export const aplicarMascaraTelefoneInteligente = (
  valor: string,
  novoValor: string
): string => {
  // Se está apagando (novo valor é menor que o anterior)
  if (novoValor.length < valor.length) {
    // Remove apenas o último caractere numérico
    const apenasDigitos = valor.replace(/\D/g, "");
    const novosDigitos = apenasDigitos.slice(0, -1);
    
    if (novosDigitos.length === 0) {
      return "";
    } else if (novosDigitos.length === 1) {
      return `(${novosDigitos}`;
    } else if (novosDigitos.length === 2) {
      return `(${novosDigitos})`;
    } else if (novosDigitos.length <= 6) {
      return `(${novosDigitos.slice(0, 2)}) ${novosDigitos.slice(2)}`;
    } else if (novosDigitos.length <= 10) {
      return `(${novosDigitos.slice(0, 2)}) ${novosDigitos.slice(
        2,
        6
      )}-${novosDigitos.slice(6)}`;
    } else {
      return `(${novosDigitos.slice(0, 2)}) ${novosDigitos.slice(
        2,
        7
      )}-${novosDigitos.slice(7, 11)}`;
    }
  } else {
    // Se está digitando, aplica a máscara normal
    return aplicarMascaraTelefone(novoValor);
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
