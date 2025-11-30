"use client";

import { getAlertasReabastecimento } from "@/api/gemini/services/CrmService";
import { useInsightData } from "../hooks/useInsightData";
import { periodoOptions } from "@/utils/assistente/constants";
import { ToastMap } from "@/models/Assistente/types";
import { AlertasRenderer } from "@/components/alertas-renderer";

import Header from "@/components/header";
import Toast from "@/components/toast";
import Select from "@/components/select";

import WarningAmberOutlined from "@mui/icons-material/WarningAmberOutlined";

const toastMap: ToastMap = {
  success: {
    title: "Sucesso",
    message: "Alertas carregados com sucesso!",
    type: "success",
  },
  error: {
    title: "Erro",
    message: "Erro ao carregar alertas. Tente novamente.",
    type: "error",
  },
};

export default function AlertasReabastecimento() {
  const { toast, loading, insight, periodo, handlePeriodoChange } =
    useInsightData({
      fetchFunction: getAlertasReabastecimento,
      errorMessage: "Erro ao buscar alertas:",
    });

  return (
    <div className="relative flex flex-col w-full min-h-screen bg-white-default">
      {toast && <Toast {...toastMap[toast]} />}

      <Header
        backRouter="/assistente"
        title="Alertas de Reabastecimento"
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="text-text-secondary text-sm">Carregando alertas...</p>
          </div>
        ) : insight ? (
          <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col gap-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-dark">
              <div className="flex items-center justify-center p-2 rounded-lg bg-orange-500 text-white">
                <WarningAmberOutlined />
              </div>
              <h2 className="text-lg font-bold text-text-default">
                Alertas de Reabastecimento
              </h2>
            </div>

            <div className="flex flex-col gap-4 text-text-default">
              <AlertasRenderer data={insight} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 p-8">
            <p className="text-text-secondary text-sm">
              Nenhum alerta disponível
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
