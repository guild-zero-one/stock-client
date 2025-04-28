import api from "../api";

const router = "/produtos-imagens";

export const todasImagens = async () => {
  try {
    const response = await api.get(router);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar imagens:", error);
    throw error;
  }
};

export const imagensPorProduto = async (produtoId: number) => {
  try {
    const response = await api.get(`${router}?fk_produto=${produtoId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar imagens por produto:", error);
    throw error;
  }
};
