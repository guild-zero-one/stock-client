"use client";

import { getRelatorioFinanceiro } from "@/api/gemini/services/CrmService";
import { useInsightData } from "../hooks/useInsightData";
import { periodoOptions } from "@/utils/assistente/constants";
import { ToastMap } from "@/models/Assistente/types";
import { InsightRenderer } from "@/components/insight-renderer";

import Header from "@/components/header";
import Toast from "@/components/toast";
import Select from "@/components/select";

import AssessmentOutlined from "@mui/icons-material/AssessmentOutlined";

const toastMap: ToastMap = {
  success: {
    title: "Sucesso",
    message: "Relatório carregado com sucesso!",
    type: "success",
  },
  error: {
    title: "Erro",
    message: "Erro ao carregar relatório. Tente novamente.",
    type: "error",
  },
};

export default function RelatorioFinanceiro() {
  const { toast, loading, insight, periodo, handlePeriodoChange } =
    useInsightData({
      fetchFunction: getRelatorioFinanceiro,
      errorMessage: "Erro ao buscar relatório financeiro:",
    });

  return (
    <div className="relative flex flex-col w-full min-h-screen bg-white-default">
      {toast && <Toast {...toastMap[toast]} />}

      <Header
        backRouter="/assistente"
        title="Relatório Financeiro"
        subtitle="Análise com IA"
      />

      <div className="flex flex-col gap-4 p-4 w-full">
        <div className="w-full">
          <Select
            name="periodo"
            label="Período de Análise"
            value={periodo}
            handleChange={handlePeriodoChange}
            options={periodoOptions}
            optionKey="id"
            optionValue="value"
            optionName="nome"
            size="small"
          />
        </div>
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-default"></div>
            <p className="text-text-secondary text-sm">
              Carregando insights...
            </p>
          </div>
        ) : insight ? (
          <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col gap-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-dark">
              <div className="flex items-center justify-center p-2 rounded-lg bg-pink-default text-white">
                <AssessmentOutlined />
              </div>
              <h2 className="text-lg font-bold text-text-default">
                Relatório Financeiro
              </h2>
            </div>

            <div className="flex flex-col gap-4 text-text-default">
              <InsightRenderer
                data={insight}
                isMainTitle={true}
                themeColor="pink"
                supportPeriodoString={true}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 p-8">
            <p className="text-text-secondary text-sm">
              Nenhum dado disponível
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
