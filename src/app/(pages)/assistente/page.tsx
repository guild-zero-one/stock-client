"use client";

import Link from "next/link";

import Header from "@/components/header";

import AssessmentOutlined from "@mui/icons-material/AssessmentOutlined";
import WarningAmberOutlined from "@mui/icons-material/WarningAmberOutlined";
import TrendingUpOutlined from "@mui/icons-material/TrendingUpOutlined";
import LightbulbOutlined from "@mui/icons-material/LightbulbOutlined";

export default function Assistente() {
  const insights = [
    {
      id: "relatorio-financeiro",
      title: "Relatório Financeiro",
      description: "Análise financeira completa com insights",
      icon: <AssessmentOutlined />,
      href: "/assistente/relatorio-financeiro",
      color: "bg-pink-default",
    },
    {
      id: "alertas-reabastecimento",
      title: "Alertas de Reabastecimento",
      description: "Produtos que precisam de atenção",
      icon: <WarningAmberOutlined />,
      href: "/assistente/alertas-reabastecimento",
      color: "bg-orange-500",
    },
    {
      id: "previsao-demanda",
      title: "Previsão de Demanda",
      description: "Projeções e tendências futuras",
      icon: <TrendingUpOutlined />,
      href: "/assistente/previsao-demanda",
      color: "bg-blue-500",
    },
    {
      id: "proxima-acao",
      title: "Próxima Ação",
      description: "Sugestões inteligentes para seu negócio",
      icon: <LightbulbOutlined />,
      href: "/assistente/proxima-acao",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="relative flex flex-col w-full min-h-screen bg-white-default">
      <Header backRouter="/" title="Assistente" subtitle="Insights com IA" />

      <div className="flex flex-col gap-4 p-4 w-full">
        <p className="text-text-secondary text-sm">
          Escolha um tipo de insight para visualizar análises inteligentes sobre
          sua base de dados.
        </p>

        <div className="flex flex-col gap-4 w-full">
          {insights.map(insight => (
            <Link key={insight.id} href={insight.href}>
              <div className="bg-white shadow-lg rounded-lg p-4 flex items-center gap-4 w-full hover:shadow-xl transition-shadow cursor-pointer">
                {/* Icon */}
                <div
                  className={`flex items-center justify-center p-3 rounded-lg text-white ${insight.color}`}
                >
                  {insight.icon}
                </div>

                {/* Info */}
                <div className="flex flex-col flex-1 gap-1">
                  <h3 className="text-sm font-bold text-text-default">
                    {insight.title}
                  </h3>
                  <p className="text-xs text-text-secondary">
                    {insight.description}
                  </p>
                </div>

                {/* Arrow */}
                <div className="text-text-secondary">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 18L15 12L9 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

