export function isProductObject(obj: any): boolean {
  // Verifica se é um objeto de produto
  return (
    obj &&
    typeof obj === "object" &&
    (obj.produto_id || obj.nome) &&
    !Array.isArray(obj)
  );
}

export function isStatusAnalysisObject(obj: any): boolean {
  // Verifica se é um objeto de análise por status
  return (
    obj &&
    typeof obj === "object" &&
    !Array.isArray(obj) &&
    (obj.status !== undefined || obj.Status !== undefined) &&
    (obj.quantidade !== undefined ||
      obj.Quantidade !== undefined ||
      obj.valor_total !== undefined ||
      obj.Valor_Total !== undefined)
  );
}

export function isActionObject(obj: any): boolean {
  // Verifica se é um objeto de ação (prioritária ou secundária)
  return (
    obj &&
    typeof obj === "object" &&
    !Array.isArray(obj) &&
    (obj.titulo ||
      obj.Titulo ||
      obj.título ||
      obj.descricao ||
      obj.Descricao ||
      obj.prioridade ||
      obj.Prioridade)
  );
}

export function isMetricsObject(obj: any): boolean {
  // Verifica se é um objeto de métricas (valores simples: números, strings curtas)
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
    return false;
  }

  const entries = Object.entries(obj);
  if (entries.length === 0) return false;

  // Verifica se todos os valores são simples (números, strings curtas, ou valores monetários)
  return entries.every(([key, value]) => {
    if (typeof value === "number") return true;
    if (typeof value === "string") {
      // Strings curtas (menos de 100 caracteres) ou valores monetários
      return value.length < 100 || /^R\$\s?\d+/.test(value);
    }
    return false;
  });
}

export function isSimpleValue(value: any): boolean {
  // Verifica se o valor é simples (string, número, boolean, null, undefined)
  // ou uma string que não precisa de formatação especial
  if (value === null || value === undefined) return true;
  if (typeof value === "boolean") return true;
  if (typeof value === "number") return true;
  if (typeof value === "string") {
    // Se for uma string muito longa com quebras de linha, não é simples
    if (value.includes("\n\n")) return false;
    // Se for uma data ISO, não é simples (precisa formatação)
    const dateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/;
    if (dateRegex.test(value)) return false;
    // Se for uma string de período no formato "2025-11-01 a 2025-11-30", não é simples
    const periodoRegex = /^(\d{4}-\d{2}-\d{2})\s+a\s+(\d{4}-\d{2}-\d{2})$/;
    if (periodoRegex.test(value)) return false;
    return true;
  }
  return false;
}

export function getProductName(item: any): string {
  // Extrai o nome do produto
  if (typeof item === "string") return item;
  if (isProductObject(item)) return item.nome || "Produto sem nome";
  if (item && typeof item === "object" && item.nome) return item.nome;
  return String(item);
}

