import api from "../api";

import { ParamValue } from "next/dist/server/request/params";

import { PedidoResponse } from "@/models/Pedido/PedidoResponse";
import { PedidoRequest } from "@/models/Pedido/PedidoRequest";

const router = "/pedidos";

export const listarPedidos = async () => {
  try {
    const response = await api.get<PedidoResponse[]>(router);
    return response.data;
  } catch (error) {
    console.error("Erro ao listar pedidos:", error);
    throw error;
  }
};

export const buscarPedidoPorId = async (id: ParamValue) => {
  try {
    const response = await api.get<PedidoResponse>(`${router}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar pedido por ID:", error);
    throw error;
  }
};

export const listarPedidosDoCliente = async (id: ParamValue) => {
  try {
    const response = await api.get<PedidoResponse[]>(
      `${router}/clientes/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao listar pedidos do cliente:", error);
    throw error;
  }
};

export const criarPedido = async (pedido: PedidoRequest) => {
  try {
    const response = await api.post<PedidoResponse>(router, pedido);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    throw error;
  }
};

export const editarPedido = async (id: ParamValue, pedido: PedidoRequest) => {
  try {
    const response = await api.put<PedidoResponse>(`${router}/${id}`, pedido);
    return response.data;
  } catch (error) {
    console.error("Erro ao editar pedido:", error);
    throw error;
  }
};

export const alterarStatusPedido = async (id: ParamValue, status: string) => {
  try {
    const response = await api.patch<PedidoResponse>(
      `${router}/status/${id}?status=${status}`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao alterar status do pedido:", error);
    throw error;
  }
};
