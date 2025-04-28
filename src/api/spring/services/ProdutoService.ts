import { Produto } from "@/models/Produto";
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

// Listar produto por marca
export const produtoPorMarca = async (marcaId: number) => {
  try {
    const response = await api.get<Produto[]>(`${router}?fk_marca=${marcaId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao listar produto:", error);
    throw error;
  }
};
