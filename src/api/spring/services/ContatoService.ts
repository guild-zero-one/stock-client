import api from "../api";

import { ContatoResponse } from "@/models/Contato/ContatoResponse";
import { ContatoRequest } from "@/models/Contato/ContatoRequest";

const router = "/contatos";

export const criarContato = async (
  clienteId: number,
  contato: ContatoRequest
) => {
  try {
    const response = await api.post<ContatoResponse>(
      `${router}/${clienteId}`,
      contato
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao criar contato:", error);
    throw error;
  }
};

export const editarContato = async (id: number, contato: ContatoRequest) => {
  try {
    const response = await api.patch<ContatoResponse>(
      `${router}/${id}`,
      contato
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao editar contato:", error);
    throw error;
  }
};
