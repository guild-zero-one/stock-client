import { Marca, MarcaCreate } from "@/models/Marca/Marca";
import { Produto } from "@/models/Produto/Produto";
import { Paginacao } from "@/models/Paginacao/Paginacao";
import api from "../api";

const router = "/marcas";

// Listar todas as Marcas com paginação
export const todasMarcas = async (page: number = 0, size: number = 10) => {
  try {
    const response = await api.get<Paginacao<Marca>>(
      `${router}?pagina=${page}&tamanho=${size}`
    );

    // Adapta o campo "last" no frontend
    const dadosPaginados = response.data;
    const last =
      dadosPaginados.page.number + 1 === dadosPaginados.page.totalPages;

    // Loga o valor de "last" para depuração
    console.log("Valor calculado de last:", last);

    return { ...dadosPaginados, last };
  } catch (error) {
    console.error("Erro ao listar marcas:", error);
    throw error;
  }
};

// Listar Marca por ID
export const marcaPorId = async (id: string) => {
  try {
    const response = await api.get<Marca>(`${router}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao listar marca:", error);
    throw error;
  }
};

// Listar produtos por Marca com paginação
export const produtosPorMarca = async (
  id: string,
  page: number = 0,
  size: number = 10
) => {
  try {
    const response = await api.get<Paginacao<Produto>>(
      `${router}/${id}/produtos?pagina=${page}&tamanho=${size}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao listar produtos por marca:", error);
    throw error;
  }
};

export const criarMarca = async (marca: MarcaCreate) => {
  try {
    const response = await api.post<Marca>(`${router}`, marca);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar marca:", error);
    throw error;
  }
};

export const atualizarFornecedor = async (id: string, marca: MarcaCreate) => {
  try {
    const response = await api.patch<Marca>(`${router}/${id}`, marca);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar marca:", error);
    throw error;
  }
};
