import api from "../api";

import { Produto } from "@/models/Produto/Produto";

const router = "/files";

export const listarProdutosPdf = async (pdf: File) => {
  const formData = new FormData();
  formData.append("file", pdf);
  try {
    const response = await api.post<Produto[]>(
      `${router}/boticario`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao listar produtos:", error);
    throw error;
  }
};
