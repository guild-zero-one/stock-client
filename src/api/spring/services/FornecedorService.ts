import { Fornecedor, FornecedorCreate } from "@/models/Fornecedor/Fornecedor";
import { Paginacao } from "@/models/Paginacao/Paginacao";
import api from "../api";

const router = "/fornecedores";

// Listar todas as Marcas
export const todasMarcas = async () => {
  try {
    const response = await api.get<Paginacao<Fornecedor>>(router);
    return response.data.content || [];
  } catch (error) {
    console.error("Erro ao listar marcas:", error);
    return [];
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

export const criarFornecedor = async (fornecedor: FornecedorCreate) => {
  try {
    const response = await api.post<Fornecedor>(`${router}`, fornecedor);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar fornecedor:", error);
    throw error;
  }
};

export const atualizarFornecedor = async (id: number, fornecedor: FornecedorCreate) => {
  try {
    const response = await api.patch<Fornecedor>(`${router}/${id}`, fornecedor);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar fornecedor:", error);
    throw error;
  }
};
