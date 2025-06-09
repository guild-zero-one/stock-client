import api from "../api";

const router = "/relatorios";

export const totalVendasMensal = async () => {
  try {
    const response = await api.get<number>(`${router}/total-vendas-mensal`);
    return response.data;
  } catch (error) {
    console.error("Erro ao listar total de vendas:", error);
    throw error;
  }
};

export const valoresVendasUltimos6Meses = async () => {
  try {
    const response = await api.get<number[]>(
      `${router}/valores-vendas-ultimos-6-meses`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao listar valores vendas últimos 6 meses:", error);
    throw error;
  }
};

export const top3ProdutosMes = async () => {
  try {
    const response = await api.get<number[]>(`${router}/top3-produtos-mes`);
    return response.data;
  } catch (error) {
    console.error("Erro ao listar top 3 produtos:", error);
    throw error;
  }
};

export const quantidadeProdutosUltimos6Meses = async () => {
  try {
    const response = await api.get<number[]>(
      `${router}/quantidade-produtos-ultimos-6-meses`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao listar quantidade produtos últimos 6 meses:", error);
    throw error;
  }
};

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
