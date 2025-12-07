import api from "../api";

import { ParamValue } from "next/dist/server/request/params";

import { PedidoResponse } from "@/models/Pedido/PedidoResponse";
import { PedidoHasCliente } from "@/models/Pedido/PedidoHasCliente";
import { PedidoRequest } from "@/models/Pedido/PedidoRequest";
import { FinalizarPedidoRequest } from "@/models/Pedido/FinalizarPedidoRequest";
import { VendaResponse } from "@/models/Venda/VendaResponse";
import { Paginacao } from "@/models/Paginacao/Paginacao";
import { buscarClientePorId } from "./ClienteService";

const router = "/pedidos";

export const listarPedidos = async (
  page: number = 0,
  size: number = 10,
  search?: string
): Promise<Paginacao<PedidoHasCliente>> => {
  try {
    let url = `${router}?pagina=${page}&tamanho=${size}`;
    if (search && search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }

    const response = await api.get<Paginacao<PedidoResponse>>(url);
    const dadosPaginados = response.data;

    // Buscar dados do cliente para cada pedido
    const pedidosComCliente: PedidoHasCliente[] = await Promise.all(
      dadosPaginados.content.map(async pedido => {
        try {
          const cliente = await buscarClientePorId(pedido.idUsuario);
          return {
            ...pedido,
            cliente,
          };
        } catch (error) {
          console.error(`Erro ao buscar cliente ${pedido.idUsuario}:`, error);
          // Retorna pedido sem cliente em caso de erro
          return {
            ...pedido,
            cliente: {
              id: 0,
              nome: "Cliente não encontrado",
              sobrenome: "",
              email: "",
              celular: "",
              ativo: false,
              permissao: "",
              qtdPedidos: 0,
              criadoEm: new Date(),
            },
          };
        }
      })
    );

    // Adapta o campo "last" no frontend
    const last =
      dadosPaginados.page.number + 1 === dadosPaginados.page.totalPages;

    return {
      ...dadosPaginados,
      content: pedidosComCliente,
      last,
    };
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

export const listarPedidosDoCliente = async (
  id: ParamValue,
  page: number = 0,
  size: number = 10
) => {
  try {
    const response = await api.get<Paginacao<PedidoResponse>>(
      `${router}/clientes/${id}?page=${page}&size=${size}`
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

export const alterarStatusPedido = async (
  id: ParamValue,
  status: "CANCELADO" | "PENDENTE" | "FINALIZADO"
) => {
  try {
    const response = await api.patch<PedidoResponse>(`${router}/${id}/status`, {
      status: status,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao alterar status do pedido:", error);
    throw error;
  }
};

export const finalizarPedido = async (
  id: ParamValue,
  finalizarPedidoRequest: FinalizarPedidoRequest
) => {
  try {
    const response = await api.post<VendaResponse>(
      `${router}/${id}/finalizar`,
      finalizarPedidoRequest
    );

    return response.data;
  } catch (error: any) {
    console.error("Erro ao finalizar pedido:", error);
    console.error("Status do erro:", error?.response?.status);
    console.error("Dados do erro:", error?.response?.data);
    throw error;
  }
};
