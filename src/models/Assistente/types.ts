export interface ToastMap {
  success: {
    title: string;
    message: string;
    type: "success";
  };
  error: {
    title: string;
    message: string;
    type: "error";
  };
}

export interface PeriodoOption {
  id: string;
  value: string;
  nome: string;
}

export interface AlertasData {
  resumo?: {
    total_criticos?: number;
    total_atencao?: number;
    produtos_analisados?: number;
    produtos_prioritarios?: number;
  };
  alertas_criticos?: any[];
  alertas_atencao?: any[];
  recomendacoes_gerais?: string[];
}

export interface ActionData {
  titulo: string;
  descricao: string;
  prioridade: string;
  impactoEsperado: string;
  prazoSugerido: string;
}
