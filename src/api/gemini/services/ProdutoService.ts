import api from "../api";
import { Produto } from "@/models/Produto/Produto";

const router = "/files/produtos";

export const produtoPorSku = async (sku: string) => {
  try {
    const response = await api.get<Produto>(`${router}/buscar?sku=${sku}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error("Erro ao listar produto por sku:", error);
    throw error;
  }
};
