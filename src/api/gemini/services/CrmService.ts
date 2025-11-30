import apiGemini from "../api";

const router = "/crm";

// Relatório Financeiro
export const getRelatorioFinanceiro = async (periodo: string = "mes_atual") => {
  try {
    const response = await apiGemini.get(`${router}/relatorio-financeiro`, {
      params: { periodo },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar relatório financeiro:", error);
    throw error;
  }
};

// Alertas de Reabastecimento
export const getAlertasReabastecimento = async (periodo: string = "mes_atual") => {
  try {
    const response = await apiGemini.get(`${router}/alertas-reabastecimento`, {
      params: { periodo },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar alertas de reabastecimento:", error);
    throw error;
  }
};

// Previsão de Demanda
export const getPrevisaoDemanda = async (periodo: string = "mes_atual") => {
  try {
    const response = await apiGemini.get(`${router}/previsao-demanda`, {
      params: { periodo },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar previsão de demanda:", error);
    throw error;
  }
};

// Próxima Ação
export const getProximaAcao = async (periodo: string = "mes_atual") => {
  try {
    const response = await apiGemini.get(`${router}/proxima-acao`, {
      params: { periodo },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar próxima ação:", error);
    throw error;
  }
};
