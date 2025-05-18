import api from "../api";

import { ParamValue } from "next/dist/server/request/params";

import { ClienteResponse } from "@/models/Cliente/ClienteResponse";
import { ClienteRequest } from "@/models/Cliente/ClienteRequest";

const router = "/usuarios";

export const listarClientes = async () => {
  try {
    const response = await api.get<ClienteResponse[]>(`${router}/clientes`);
    return response.data;
  } catch (error) {
    console.error("Erro ao listar clientes:", error);
    throw error;
  }
};

export const buscarClientePorId = async (id: ParamValue) => {
  try {
    const response = await api.get<ClienteResponse>(`${router}/clientes/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao listar cliente por ID:", error);
    throw error;
  }
};

export const criarCliente = async (cliente: ClienteRequest) => {
  try {
    const response = await api.post<ClienteResponse>(`${router}`, cliente);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    throw error;
  }
};

export const editarCliente = async (
  id: ParamValue,
  cliente: ClienteRequest
) => {
  try {
    const response = await api.patch<ClienteResponse>(
      `${router}/${id}`,
      cliente
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    throw error;
  }
};

export const desativarCliente = async (id: ParamValue) => {
  try {
    const response = await api.patch(`${router}/desativar/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao desativar cliente:", error);
    throw error;
  }
};
