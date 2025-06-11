import { Produto, ProdutoCreate } from "@/models/Produto/Produto";
import api from "../api";

const router = "/produtos";

// Listar Todos produtos
export const todosProdutos = async () => {
  try {
    const response = await api.get<Produto[]>(router);
    return response.data;
  } catch (error) {
    console.error("Erro ao listar produtos:", error);
    throw error;
  }
};

// Listar produto por ID
export const produtoPorId = async (id: number) => {
  try {
    const response = await api.get<Produto>(`${router}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao listar produto:", error);
    throw error;
  }
};

export const produtoPorSku = async (sku: string) => {
  try {
    const response = await api.get<Produto>(`${router}/sku?sku=${sku}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao listar produto por sku:", error);
    throw error;
  }
};

// Listar produto por marca
export const produtoPorMarca = async (marcaId: number) => {
  try {
    const response = await api.get<Produto[]>(
      `${router}/fornecedor/${marcaId}`
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

export const atualizarProduto = async (id: number, produto: Produto) => {
  try {
    const response = await api.patch<Produto>(`${router}/${id}`, produto);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    throw error;
  }
};
