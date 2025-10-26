import { Produto, ProdutoCreate } from "@/models/Produto/Produto";
import { Paginacao } from "@/models/Paginacao/Paginacao";
import { validateProductId } from "@/utils/uuidValidator";

import api from "../api";

const router = "/produtos";

// Listar Todos produtos com paginação
export const todosProdutos = async (page: number = 0, size: number = 10) => {
  try {
    const response = await api.get<Paginacao<Produto>>(
      `${router}?pagina=${page}&tamanho=${size}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao listar produtos:", error);
    throw error;
  }
};

// Listar produto por ID
export const produtoPorId = async (id: string) => {
  try {
    // Validação do ID do produto
    if (!validateProductId(id)) {
      throw new Error(
        `ID do produto inválido: ${id}. Esperado um UUID válido.`
      );
    }

    const response = await api.get<Produto>(`${router}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao listar produto:", error);
    throw error;
  }
};

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

// Listar produto por marca com paginação
export const produtoPorMarca = async (
  idMarca: string,
  page: number = 0,
  size: number = 10
) => {
  try {
    const response = await api.get<Paginacao<Produto>>(
      `${router}/marca/${idMarca}?pagina=${page}&tamanho=${size}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao listar produto:", error);
    throw error;
  }
};

export const cadastrarProduto = async (produto: ProdutoCreate) => {
  try {
    const response = await api.post<Produto>(router, produto);
    return response.data;
  } catch (error) {
    console.error("Erro ao cadastrar produto:", error);
    throw error;
  }
};

export const atualizarProduto = async (id: string, produto: Produto) => {
  try {
    const response = await api.put<Produto>(`${router}/${id}`, produto);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    throw error;
  }
};
