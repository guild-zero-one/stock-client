import { Marca } from "@/models/Marca";
import api from "../api";

const router = "/marcas";

// Listar todas as categorias
export const todasMarcas = async () => {
  try {
    const response = await api.get<Marca[]>(router);
    return response.data;
  } catch (error) {
    console.error("Erro ao listar categorias:", error);
    throw error;
  }
};

// Listar marca por ID
export const marcaPorId = async (marcaId: number) => {
  try {
    const response = await api.get<Marca>(`${router}/${marcaId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao listar categoria:", error);
    throw error;
  }
};

// Listar produtos por categoria
export const produtosPorMarca = async (categoriaId: number) => {
  try {
    const response = await api.get<Marca>(`${router}/${categoriaId}`);
    return response.data.produtos;
  } catch (error) {
    console.error("Erro ao listar produtos por categoria:", error);
    throw error;
  }
};
