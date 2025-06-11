import api from "../api";

import { VendaResponse } from "@/models/Venda/VendaResponse";
import { VendaRequest } from "@/models/Venda/VendaRequest";

const router = "/vendas";

export const cadastrarVenda = async (venda: VendaRequest) => {
  try {
    const response = await api.post<VendaResponse>(router, venda);
    return response.data;
  } catch (error) {
    console.error("Erro ao cadastrar venda:", error);
    throw error;
  }
};
