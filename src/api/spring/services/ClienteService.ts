import api from "../api";

import { ParamValue } from "next/dist/server/request/params";

import { ClienteResponse } from "@/models/Cliente/ClienteResponse";
import { ClienteRequest } from "@/models/Cliente/ClienteRequest";
import { Paginacao } from "@/models/Paginacao/Paginacao";

const router = "/usuarios";

export const listarClientes = async (page: number = 0, size: number = 10) => {
  try {
    const response = await api.get<Paginacao<ClienteResponse>>(
      `${router}/clientes?pagina=${page}&tamanho=${size}`
    );
    // Adapta o campo "last" no frontend
    const dadosPaginados = response.data;
    const last =
      dadosPaginados.page.number + 1 === dadosPaginados.page.totalPages;

    // Loga o valor de "last" para depuração
    console.log("Valor calculado de last:", last);

    return { ...dadosPaginados, last };
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
    const response = await api.put<ClienteResponse>(`${router}/${id}`, cliente);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    throw error;
  }
};

export const desativarCliente = async (id: ParamValue) => {
  try {
    const response = await api.patch(`${router}/${id}/desativar`);
    return response.data;
  } catch (error) {
    console.error("Erro ao desativar cliente:", error);
    throw error;
  }
};

export const ativarCliente = async (id: ParamValue) => {
  try {
    const response = await api.patch(`${router}/${id}/ativar`);
    return response.data;
  } catch (error) {
    console.error("Erro ao ativar cliente:", error);
    throw error;
  }
};
