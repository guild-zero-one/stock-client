import api from "../api";

const router = "/imagens/produto";

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
    const response = await api.get(`${router}/${produtoId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar imagens por produto:", error);
    throw error;
  }
};

export const cadastrarImagem = async (produtoId: number, imagem: File) => {
  const formData = new FormData();
  formData.append("imagem", imagem);
  formData.append(
    "dados",
    JSON.stringify({
      imagemPrincipal: true,
      produtoId: produtoId,
    })
  );

  try {
    const response = await api.post(`${router}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao cadastrar imagem:", error);
    throw error;
  }
};
