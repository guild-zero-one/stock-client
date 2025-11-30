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
  Resumo?: {
    Total_Criticos?: number;
    Total_Atencao?: number;
    Produtos_Analisados?: number;
    Produtos_Prioritarios?: number;
  };
  alertas_criticos?: any[];
  Alertas_Criticos?: any[];
  alertas_atencao?: any[];
  Alertas_Atencao?: any[];
  recomendacoes_gerais?: string[];
  Recomendacoes_Gerais?: string[];
}

export interface ActionData {
  titulo: string;
  descricao: string;
  prioridade: string;
  impactoEsperado: string;
  prazoSugerido: string;
}
