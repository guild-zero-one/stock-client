import { Fornecedor } from "@/models/Fornecedor/Fornecedor";
import api from "../api";

const router = "/fornecedores";

// Listar todas as categorias
export const todasMarcas = async () => {
  try {
    const response = await api.get<[Fornecedor]>(router);
    console.log("resposta: ",response.data)
    return response.data;
  } catch (error) {
    console.error("Erro ao listar categorias:", error);
    throw error;
  }
};

// Listar marca por ID
export const marcaPorId = async (id: number) => {
  try {
    const response = await api.get<Fornecedor>(`${router}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao listar categoria:", error);
    throw error;
  }
};

// Listar produtos por categoria
export const produtosPorMarca = async (id: number) => {
  try {
    const response = await api.get<Fornecedor>(`${router}/${id}`);
    return response.data.produtos;
  } catch (error) {
    console.error("Erro ao listar produtos por categoria:", error);
    throw error;
  }
};
