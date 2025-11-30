import api from "../api";

import { Top3ProdutosResponse } from "@/models/Relatorio/Top3ProdutosResponse";

const router = "/relatorios";

export const quantidadePedidosEmAberto = async () => {
  try {
    const response = await api.get<number>(
      `${router}/quantidade-pedidos-em-aberto`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao listar quantidade pedidos em aberto:", error);
    throw error;
  }
};

export const totalVendasMensal = async () => {
  try {
    const response = await api.get<number>(`${router}/total-vendas-mensal`);
    return response.data;
  } catch (error) {
    console.error("Erro ao listar total de vendas:", error);
    throw error;
  }
};

export const top3ProdutosMes = async () => {
  try {
    const response = await api.get<Top3ProdutosResponse[]>(
      `${router}/top3-produtos-mes-atual`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao listar top 3 produtos:", error);
    throw error;
  }
};

export const faturamentoUltimos6Meses = async () => {
  try {
    const response = await api.get<Record<string, number>>(
      `${router}/faturamento-ultimos-6-meses`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao listar valores vendas últimos 6 meses:", error);
    throw error;
  }
};

export const quantidadePedidosUltimos6Meses = async () => {
  try {
    const response = await api.get<Record<string, number>>(
      `${router}/quantidade-pedidos-ultimos-6-meses`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao listar quantidade produtos últimos 6 meses:", error);
    throw error;
  }
};

export const faturamentoUltimos4Meses = async () => {
  try {
    const response = await api.get<Record<string, number>>(
      `${router}/faturamento-ultimos-4-meses`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao listar faturamento últimos 4 meses:", error);
    throw error;
  }
};

export const pedidosPorStatusMesAtual = async () => {
  try {
    const response = await api.get<Record<string, number>>(
      `${router}/pedidos-por-status-mes-atual`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao listar pedidos por status do mês atual:", error);
    throw error;
  }
};
