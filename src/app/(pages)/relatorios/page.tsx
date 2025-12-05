"use client";

import { useState, useEffect } from "react";

import dynamic from "next/dynamic";

const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

// Hook para detectar tamanho da tela
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
    height: typeof window !== "undefined" ? window.innerHeight : 768,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return windowSize;
}

import {
  top3ProdutosMes,
  totalVendasMensal,
  faturamentoUltimos6Meses,
  pedidosPorStatusMesAtual,
} from "@/api/spring/services/RelatorioService";

import { Top3ProdutosResponse } from "@/models/Relatorio/Top3ProdutosResponse";

import Header from "@/components/header";

export default function Dashboard() {
  const { width } = useWindowSize();
  const [isMounted, setIsMounted] = useState(false);
  const [kpiVendas, setKpiVendas] = useState(0);
  const [kpiTop3Produtos, setKpiTop3Produtos] = useState<
    Top3ProdutosResponse[]
  >([]);
  const [faturamento6Meses, setFaturamento6Meses] = useState<
    Record<string, number>
  >({});
  const [pedidosPorStatus, setPedidosPorStatus] = useState<
    Record<string, number>
  >({});

  // Altura dinâmica do gráfico baseada no tamanho da tela
  // Usa valor padrão até o componente montar no cliente para evitar hydration mismatch
  const chartHeight = isMounted && width < 640 ? 250 : 300;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const totalVendas = await totalVendasMensal();
        setKpiVendas(totalVendas);

        const top3Produtos = await top3ProdutosMes();
        setKpiTop3Produtos(top3Produtos);

        const faturamento = await faturamentoUltimos6Meses();
        setFaturamento6Meses(faturamento);

        const pedidosStatus = await pedidosPorStatusMesAtual();
        setPedidosPorStatus(pedidosStatus);
      } catch (error) {
        console.error("Erro ao buscar dados de relatórios:", error);
      }
    };
    fetchData();
  }, []);

  // Preparar dados para o gráfico de pizza
  const statusLabels = Object.keys(pedidosPorStatus);
  const statusValues = Object.values(pedidosPorStatus);
  const statusColors: Record<string, string> = {
    PENDENTE: "#FFA500",
    CONCLUIDO: "#28a745",
    CANCELADO: "#dc3545",
  };

  const pieChartOptions = {
    chart: {
      type: "pie" as const,
      toolbar: { show: false },
      width: "100%",
    },
    title: {
      text: "Pedidos por Status - Mês Atual",
      align: "center" as const,
      style: {
        fontSize: width < 640 ? "16px" : "18px",
        fontWeight: "bold",
        fontFamily: "Nunito, Arial, sans-serif",
        color: "#a6036d",
      },
    },
    labels: statusLabels,
    colors: statusLabels.map(label => statusColors[label] || "#a6036d"),
    legend: {
      position: "bottom" as const,
      fontSize: width < 640 ? "11px" : "14px",
      fontFamily: "Nunito, Arial, sans-serif",
      itemMargin: {
        horizontal: width < 640 ? 5 : 10,
        vertical: width < 640 ? 3 : 5,
      },
      horizontalAlign: "center" as const,
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} pedido(s)`,
      },
    },
    plotOptions: {
      pie: {
        offsetY: 0,
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: width < 640 ? "14px" : "18px",
        fontWeight: "bold",
        fontFamily: "Nunito, Arial, sans-serif",
        colors: ["#FFFFFF"],
      },
      dropShadow: {
        enabled: false,
      },
      offsetY: 0,
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: {
            width: "100%",
            height: 280,
          },
          legend: {
            position: "bottom" as const,
            fontSize: "11px",
            itemMargin: {
              horizontal: 5,
              vertical: 3,
            },
            horizontalAlign: "center" as const,
          },
          title: {
            align: "center" as const,
            style: {
              fontSize: "16px",
            },
          },
          dataLabels: {
            style: {
              fontSize: "14px",
              fontWeight: "bold",
              fontFamily: "Nunito, Arial, sans-serif",
              colors: ["#FFFFFF"],
            },
            dropShadow: {
              enabled: false,
            },
            offsetY: 0,
          },
        },
      },
    ],
  };

  const pieChartSeries = statusValues;

  // Preparar dados da tabela de faturamento
  // O backend já retorna os meses ordenados (mais recente primeiro)
  const mesesOrdenados = Object.keys(faturamento6Meses);

  return (
    <div className="relative flex flex-col w-full h-screen bg-white-default gap-2">
      <section className="flex flex-col gap-2 p-4 w-full h-full overflow-y-auto">
        <Header title="Geral" subtitle="Relatórios" backRouter="/" />

        {/* KPIs - Linha 1 */}
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <div className="bg-white shadow-lg w-full rounded-lg p-4 flex flex-col justify-center items-center min-h-[100px]">
            <h3 className="text-xs text-left text-gray-600 mb-2 w-full">
              Vendas R$ Mensal
            </h3>
            <div className="flex items-center justify-center w-full flex-1">
              <h2 className="font-bold text-2xl text-center text-pink-default">
                R${" "}
                {Number(kpiVendas).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </h2>
            </div>
          </div>

          <div className="bg-white shadow-lg w-full rounded-lg p-4 flex flex-col min-h-[100px]">
            <h3 className="text-xs text-gray-600 mb-3 font-semibold">
              Top 3 Produtos - Mês Atual
            </h3>
            <div className="flex flex-col gap-2 flex-1">
              {kpiTop3Produtos.length > 0 ? (
                kpiTop3Produtos.map((produto, idx) => (
                  <div
                    key={produto.id}
                    className="flex items-start gap-2 p-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-default text-white flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-semibold text-sm text-text-default truncate"
                        title={produto.nome}
                      >
                        {produto.nome}
                      </p>
                      <div className="flex gap-3 mt-1 text-xs text-gray-500">
                        <span>Qtd: {produto.quantidadeVendida}</span>
                        <span>
                          R${" "}
                          {Number(produto.valorTotalVendido).toLocaleString(
                            "pt-BR",
                            {
                              minimumFractionDigits: 2,
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-400">Carregando...</div>
              )}
            </div>
          </div>
        </div>

        {/* Tabela de Faturamento - Linha 2 */}
        <div className="bg-white rounded-lg shadow-lg p-4 w-full">
          <h3 className="text-lg font-bold text-pink-default mb-4">
            Faturamento - Últimos 6 Meses
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-3 text-sm font-semibold text-gray-700">
                    Mês
                  </th>
                  <th className="text-right p-3 text-sm font-semibold text-gray-700">
                    Valor Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {mesesOrdenados.length > 0 ? (
                  mesesOrdenados.map(mes => (
                    <tr
                      key={mes}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="p-3 text-sm text-text-default">{mes}</td>
                      <td className="p-3 text-sm text-right font-semibold text-text-default">
                        R${" "}
                        {Number(faturamento6Meses[mes] || 0).toLocaleString(
                          "pt-BR",
                          { minimumFractionDigits: 2 }
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="p-4 text-center text-gray-400">
                      Carregando dados...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Gráfico de Pizza - Linha 3 */}
        <div className="bg-white rounded-lg shadow-lg p-4 w-full flex items-center justify-center">
          {statusLabels.length > 0 && statusValues.some(v => v > 0) ? (
            <div className="w-full flex justify-center">
              <ApexCharts
                options={pieChartOptions}
                series={pieChartSeries}
                type="pie"
                height={chartHeight}
              />
            </div>
          ) : (
            <div
              className="flex items-center justify-center"
              style={{ minHeight: `${chartHeight}px` }}
            >
              <p className="text-gray-400">Carregando dados do gráfico...</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
