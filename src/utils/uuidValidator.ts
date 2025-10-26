// Utilitário para validação de UUIDs
export function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export function validateProductId(id: string): boolean {
  if (!id || id.trim() === "") {
    return false;
  }

  // Verifica se não é "sku" ou outros valores inválidos
  if (id === "sku" || id === "id" || id === "produto") {
    return false;
  }

  // Verifica se é um UUID válido
  return isValidUUID(id);
}
