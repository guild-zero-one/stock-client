import { Fornecedor } from "@/models/Fornecedor/Fornecedor";
import api from "../api";

const router = "/fornecedores";

// Listar todas as Marcas
export const todasMarcas = async () => {
  try {
    const response = await api.get<Paginacao<Fornecedor>>(router);
    console.log("resposta: ", response.data)
    return response.data.content;
  } catch (error) {
    console.error("Erro ao listar marcas:", error);
    throw error;
  }
};

// Listar Marca por ID
export const marcaPorId = async (id: number) => {
  try {
    const response = await api.get<Fornecedor>(`${router}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao listar marca:", error);
    throw error;
  }
};

// Listar produtos por Marca
export const produtosPorMarca = async (id: number) => {
  try {
    const response = await api.get<Fornecedor>(`${router}/${id}`);
    return response.data.produtos;
  } catch (error) {
    console.error("Erro ao listar produtos por marca:", error);
    throw error;
  }
};
